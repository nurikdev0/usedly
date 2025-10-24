import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import * as url from 'url';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';

interface PrivateMessagePayload {
	event: string;
	text: string;
	chatRoomId: string;
	receiverId: string;
	senderData: Partial<Member>;
	timestamp: Date;
	messageId?: string;
}

interface TypingPayload {
	event: string;
	chatRoomId: string;
	isTyping: boolean;
	memberData: Partial<Member>;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private clientsAuthMap = new Map<WebSocket, Member>();
	private userConnections = new Map<string, WebSocket>(); // memberId -> WebSocket

	constructor(
		private authService: AuthService,
		@InjectModel('ChatRoom') private chatRoomModel: Model<any>,
		@InjectModel('Message') private messageModel: Model<any>,
	) {}

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		console.log('WebSocket Server Initialized');
	}

	private async retrieveAuth(req: any): Promise<Member> {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			return null;
		}
	}

	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retrieveAuth(req);

		if (!authMember) {
			client.close();
			return;
		}

		this.clientsAuthMap.set(client, authMember);
		this.userConnections.set(authMember._id.toString(), client);

		// Send pending messages if any
		await this.sendPendingMessages(authMember._id.toString(), client);

		client.send(
			JSON.stringify({
				event: 'connected',
				message: 'Successfully connected to chat',
			}),
		);
	}

	public handleDisconnect(client: WebSocket) {
		const authMember = this.clientsAuthMap.get(client);

		if (authMember) {
			this.userConnections.delete(authMember._id.toString());
		}

		this.clientsAuthMap.delete(client);
	}

	@SubscribeMessage('joinChatRoom')
	public async handleJoinChatRoom(client: WebSocket, payload: any): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);
		if (!authMember) return;

		let chatRoomId = payload.chatRoomId;

		if (!chatRoomId && payload.propertyId) {
			const chatRoom = await this.findOrCreateChatRoom(payload.propertyId, payload.sellerId, payload.buyerId);
			chatRoomId = chatRoom._id.toString();
			console.log('Created/Found chatRoom:', chatRoomId);
		}

		if (!chatRoomId) {
			client.send(
				JSON.stringify({
					event: 'error',
					message: 'chatRoomId is required or provide propertyId to create one',
				}),
			);
			return;
		}

		await this.messageModel.updateMany(
			{
				chatRoomId,
				receiverId: authMember._id,
				messageStatus: { $in: ['SENT', 'DELIVERED'] },
			},
			{ messageStatus: 'READ' },
		);

		client.send(
			JSON.stringify({
				event: 'joinedChatRoom',
				chatRoomId: chatRoomId,
				propertyId: payload.propertyId,
			}),
		);
	}

	private async findOrCreateChatRoom(propertyId: string, sellerId: string, buyerId: string) {
		let chatRoom = await this.chatRoomModel.findOne({
			propertyId: propertyId,
			$or: [
				{ sellerId: sellerId, buyerId: buyerId },
				{ sellerId: buyerId, buyerId: sellerId },
			],
		});

		if (!chatRoom) {
			chatRoom = new this.chatRoomModel({
				propertyId: propertyId,
				sellerId: sellerId,
				buyerId: buyerId,
			});
			await chatRoom.save();
			console.log('New chat room created:', chatRoom._id);
		} else {
			console.log('Existing chat room found:', chatRoom._id);
		}

		return chatRoom;
	}

	@SubscribeMessage('privateMessage')
	public async handlePrivateMessage(client: WebSocket, payload: any): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);
		if (!authMember) return;

		const { text, chatRoomId, receiverId } = payload;

		try {
			// Verify chat room exists and user is participant
			const chatRoom = await this.chatRoomModel.findOne({
				_id: chatRoomId,
				$or: [{ sellerId: authMember._id }, { buyerId: authMember._id }],
			});

			if (!chatRoom) {
				client.send(
					JSON.stringify({
						event: 'error',
						message: 'Chat room not found or access denied',
					}),
				);
				return;
			}

			// Save message to database
			const newMessage = new this.messageModel({
				chatRoomId,
				senderId: authMember._id,
				receiverId,
				messageText: text,
			});

			const savedMessage = await newMessage.save();

			// Update chat room last message
			await this.chatRoomModel.findByIdAndUpdate(chatRoomId, {
				lastMessage: text,
				updatedAt: new Date(),
			});

			// Prepare message payload
			const messagePayload: PrivateMessagePayload = {
				event: 'privateMessage',
				text,
				chatRoomId,
				receiverId,
				senderData: {
					_id: authMember._id,
					memberNick: authMember.memberNick,
					memberImage: authMember.memberImage,
				},
				timestamp: savedMessage.createdAt,
				messageId: savedMessage._id.toString(),
			};

			// Send to receiver if online
			const receiverClient = this.userConnections.get(receiverId);
			if (receiverClient && receiverClient.readyState === WebSocket.OPEN) {
				receiverClient.send(JSON.stringify(messagePayload));

				// Update message status to delivered
				await this.messageModel.findByIdAndUpdate(savedMessage._id, {
					messageStatus: 'DELIVERED',
				});
			}

			// Also send back to sender for confirmation
			client.send(JSON.stringify(messagePayload));
		} catch (error) {
			console.error('Error sending message:', error);
			client.send(
				JSON.stringify({
					event: 'error',
					message: 'Failed to send message',
				}),
			);
		}
	}

	@SubscribeMessage('typing')
	public async handleTyping(client: WebSocket, payload: any): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);
		if (!authMember) return;

		const { chatRoomId, receiverId, isTyping } = payload;

		const typingPayload: TypingPayload = {
			event: 'typing',
			chatRoomId,
			isTyping,
			memberData: {
				_id: authMember._id,
				memberNick: authMember.memberNick,
			},
		};

		// Send typing indicator to receiver
		const receiverClient = this.userConnections.get(receiverId);
		if (receiverClient && receiverClient.readyState === WebSocket.OPEN) {
			receiverClient.send(JSON.stringify(typingPayload));
		}
	}

	@SubscribeMessage('messageRead')
	public async handleMessageRead(client: WebSocket, payload: any): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);
		if (!authMember) return;

		const { messageId, chatRoomId, senderId } = payload;

		try {
			// Update message status to read
			await this.messageModel.findByIdAndUpdate(messageId, {
				messageStatus: 'READ',
			});

			// Notify sender that message was read
			const senderClient = this.userConnections.get(senderId);
			if (senderClient && senderClient.readyState === WebSocket.OPEN) {
				senderClient.send(
					JSON.stringify({
						event: 'messageRead',
						messageId,
						chatRoomId,
						readerId: authMember._id,
					}),
				);
			}
		} catch (error) {
			console.error('Error marking message as read:', error);
		}
	}

	private async sendPendingMessages(userId: string, client: WebSocket) {
		try {
			// Find unread messages for this user
			const pendingMessages = await this.messageModel
				.find({
					receiverId: userId,
					messageStatus: { $in: ['SENT', 'DELIVERED'] },
				})
				.populate('senderId', 'memberNick memberImage');

			for (const message of pendingMessages) {
				const messagePayload: PrivateMessagePayload = {
					event: 'privateMessage',
					text: message.messageText,
					chatRoomId: message.chatRoomId.toString(),
					receiverId: message.receiverId.toString(),
					senderData: {
						_id: message.senderId._id,
						memberNick: message.senderId.memberNick,
						memberImage: message.senderId.memberImage,
					},
					timestamp: message.createdAt,
					messageId: message._id.toString(),
				};

				client.send(JSON.stringify(messagePayload));

				// Update status to delivered if it was sent
				if (message.messageStatus === 'SENT') {
					await this.messageModel.findByIdAndUpdate(message._id, {
						messageStatus: 'DELIVERED',
					});
				}
			}
		} catch (error) {
			console.error('Error sending pending messages:', error);
		}
	}
}

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Stack, Typography, Avatar, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ChatLayoutContainer, SidebarContainer } from '../../../scss/pc/message/message';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_ALL_MESSAGES } from '../../../apollo/user/query';
import { socketVar, userVar } from '../../../apollo/store';
import { NextPage } from 'next';
import { Message } from '../../types/message/message';

const ChatMessages: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState('');

	/** APOLLO REQUESTS **/

	const {
		loading: getMessagesLoading,
		data: getMessagesData,
		error: getMessagesError,
		refetch: getMessagesRefetch,
	} = useQuery(GET_ALL_MESSAGES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 100,
				sort: 'createdAt',
				direction: 'ASC',
				search: {
					chatRoomId: router.query.chatId,
				},
			},
		},
		onCompleted: (data) => {
			setMessages(data?.getMessages?.list);
		},
	});

	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (event: MessageEvent) => {
			try {
				const messageData = JSON.parse(event.data);

				if (messageData?.event === 'privateMessage') {
					const msg = messageData;

					const chatId = router.query.chatId as string;
					if (!chatId) return;

					const isCurrentRoom = msg.chatRoomId === chatId;
					const isReceiver = msg.receiverId === user._id;

					if (isCurrentRoom || isReceiver) {
						setMessages((prev) => [
							...prev,
							{
								_id: msg.messageId,
								chatRoomId: msg.chatRoomId,
								senderId: msg.senderData._id,
								receiverId: msg.receiverId,
								messageText: msg.text,
								timestamp: msg.timestamp,
								senderData: msg.senderData,
								messageStatus: 'SENT',
							},
						]);
					} else {
						console.log('error:', msg);
					}
				}
				if (messageData?.event === 'messageRead') {
					const { messageId } = messageData;

					setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, messageStatus: 'READ' } : msg)));
				}
			} catch (err) {
				console.error('Invalid message data', err);
			}
		};

		return () => {
			socket.onmessage = null;
		};
	}, [socket, router.query.chatId, user._id]);

	/** Scroll to bottom and mark as read once **/
	useEffect(() => {
		if (!socket || !user?._id || messages.length === 0) return;

		requestAnimationFrame(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		});

		const unreadMessages = messages.filter((msg) => msg.receiverId === user._id && msg.messageStatus !== 'READ');

		if (unreadMessages.length > 0) {
			unreadMessages.forEach((msg) => {
				socket.send(
					JSON.stringify({
						event: 'messageRead',
						data: {
							messageId: msg._id,
							chatRoomId: msg.chatRoomId,
							senderId: msg.senderId,
						},
					}),
				);
			});
		}
	}, [messages.length]);

	const handleSend = () => {
		if (!inputValue.trim() || !socket) return;

		const newMessage = {
			event: 'privateMessage',
			data: {
				text: inputValue,
				chatRoomId: router.query.chatId as string,
				receiverId: router.query.receiverId as string,
			},
		};

		socket.send(JSON.stringify(newMessage));
		setInputValue('');
	};

	return (
		<ChatLayoutContainer>
			<SidebarContainer>
				<Stack height="100%" justifyContent="space-between">
					{/* HEADER */}
					<Paper
						elevation={0}
						sx={{
							p: 2,
							borderBottom: '1px solid #eee',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 2,
						}}
					>
						<Box display="flex" alignItems="center" gap={2}>
							<Avatar alt="John Doe" src="/img/profile/defaultUser.svg" />
							<Box>
								<Typography variant="subtitle1" fontWeight="600">
									John Doe
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Online
								</Typography>
							</Box>
						</Box>

						<Box display="flex" alignItems="center" gap={1.5}>
							<Avatar
								variant="rounded"
								src="/img/products/sample-product.jpg"
								sx={{ width: 40, height: 40, borderRadius: 1 }}
							/>
							<Typography variant="subtitle2" fontWeight={500}>
								iPhone 15 Pro
							</Typography>
						</Box>
					</Paper>

					{/* MESSAGES */}
					<Box
						sx={{
							flex: 1,
							overflowY: 'auto',
							p: 3,
							display: 'flex',
							flexDirection: 'column',
							gap: 1.5,
							backgroundColor: '#fafafa',
						}}
					>
						{messages.map((msg: any) => (
							<Box
								key={msg._id}
								sx={{
									display: 'flex',
									justifyContent: msg.senderId === user._id ? 'flex-end' : 'flex-start',
								}}
							>
								<Box
									sx={{
										maxWidth: '70%',
										bgcolor: msg.senderId === user._id ? 'primary.main' : 'grey.200',
										color: msg.senderId === user._id ? 'white' : 'black',
										px: 2,
										py: 1,
										borderRadius: 2,
										borderBottomRightRadius: msg.senderId === user._id ? 0 : 2,
										borderBottomLeftRadius: msg.senderId === user._id ? 2 : 0,
										wordBreak: 'break-word',
									}}
								>
									<Typography variant="body2">{msg.messageText}</Typography>
									{msg.senderId === user._id && (
										<Typography
											variant="caption"
											sx={{ position: 'related', bottom: -16, right: 4, fontSize: '0.75rem', color: 'grey.300' }}
										>
											{msg.messageStatus}
										</Typography>
									)}
								</Box>
							</Box>
						))}
					</Box>

					{/* MESSAGE INPUT */}
					<Paper
						elevation={3}
						sx={{
							p: 2,
							display: 'flex',
							alignItems: 'center',
							gap: 1.5,
							borderTop: '1px solid #eee',
						}}
					>
						<TextField
							fullWidth
							size="small"
							placeholder="Type your message..."
							variant="outlined"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSend()}
						/>
						<IconButton color="primary" onClick={handleSend}>
							<SendIcon />
						</IconButton>
					</Paper>
				</Stack>
			</SidebarContainer>
		</ChatLayoutContainer>
	);
};

export default ChatMessages;

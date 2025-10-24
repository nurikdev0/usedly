import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ChatRoom } from '../../libs/dto/chat-room/chat-room';
import { Direction, Message as MessageEnum } from '../../libs/enums/common.enum';
import { MessagesInquiry } from '../../libs/dto/message/message.input';
import { Message, Messages } from '../../libs/dto/message/message';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';

@Injectable()
export class MessageService {
	constructor(
		@InjectModel('ChatRoom') private readonly chatRoomModel: Model<ChatRoom>,
		@InjectModel('Message') private readonly messageModel: Model<Message>,
	) {}

	public async getMessages(memberId: ObjectId, input: MessagesInquiry): Promise<Messages> {
		const { chatRoomId } = input.search;
		const chatId = shapeIntoMongoObjectId(chatRoomId);
		const chatRoom = await this.chatRoomModel
			.findOne({
				_id: chatId,
				$or: [{ sellerId: memberId }, { buyerId: memberId }],
			})
			.lean()
			.exec();

		if (!chatRoom) {
			throw new InternalServerErrorException(MessageEnum.BAD_REQUEST);
		}

		const match: T = {
			chatRoomId: chatRoom._id,
		};

		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		const result = await this.messageModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) {
			throw new InternalServerErrorException(MessageEnum.NO_DATA_FOUND);
		}

		return result[0];
	}
}

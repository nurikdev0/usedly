import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ChatRoom, ChatRooms } from '../../libs/dto/chat-room/chat-room';
import { ChatRoomsInquiry } from '../../libs/dto/chat-room/chat-room.input';
import { T } from '../../libs/types/common';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Direction, Message } from '../../libs/enums/common.enum';

@Injectable()
export class ChatRoomService {
	constructor(@InjectModel('ChatRoom') private readonly chatRoomModel: Model<ChatRoom>) {}

	public async getChatRooms(memberId: ObjectId, input: ChatRoomsInquiry): Promise<ChatRooms> {
		const { propertyId } = input.search;

		const match: T = {
			$or: [{ sellerId: memberId }, { buyerId: memberId }],
		};
		const sort: T = {
			[input?.sort ?? 'updatedAt']: input?.direction ?? Direction.DESC,
		};

		if (propertyId) {
			match.propertyId = shapeIntoMongoObjectId(propertyId);
		}

		const result = await this.chatRoomModel
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
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		return result[0];
	}
}

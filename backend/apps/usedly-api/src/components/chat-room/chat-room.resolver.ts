import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ChatRooms } from '../../libs/dto/chat-room/chat-room';
import { ChatRoomsInquiry } from '../../libs/dto/chat-room/chat-room.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { ChatRoomService } from './chat-room.service';

@Resolver()
export class ChatRoomResolver {
	constructor(private readonly chatRoomService: ChatRoomService) {}

	@UseGuards(AuthGuard)
	@Query(() => ChatRooms)
	public async getChatRooms(
		@Args('input') input: ChatRoomsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ChatRooms> {
		console.log('Query: getChatRooms');
		return await this.chatRoomService.getChatRooms(memberId, input);
	}
}

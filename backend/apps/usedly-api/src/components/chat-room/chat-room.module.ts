import { Module } from '@nestjs/common';
import { ChatRoomResolver } from './chat-room.resolver';
import { ChatRoomService } from './chat-room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import ChatRoomSchema from '../../schemas/ChatRoom.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'ChatRoom',
				schema: ChatRoomSchema,
			},
		]),
		AuthModule,
	],
	providers: [ChatRoomResolver, ChatRoomService],
})
export class ChatRoomModule {}

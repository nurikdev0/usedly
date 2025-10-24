import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import MessageSchema from '../../schemas/Message.model';
import { AuthModule } from '../auth/auth.module';
import ChatRoomSchema from '../../schemas/ChatRoom.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Message',
				schema: MessageSchema,
			},
		]),
		MongooseModule.forFeature([
			{
				name: 'ChatRoom',
				schema: ChatRoomSchema,
			},
		]),
		AuthModule,
	],
	providers: [MessageResolver, MessageService],
})
export class MessageModule {}

import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../components/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import ChatRoomSchema from '../schemas/ChatRoom.model';
import MessageSchema from '../schemas/Message.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'ChatRoom', schema: ChatRoomSchema },
			{ name: 'Message', schema: MessageSchema },
		]),
		AuthModule,
	],
	providers: [SocketGateway],
})
export class SocketModule {}

import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Message {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	chatRoomId: ObjectId;

	@Field(() => String)
	senderId: ObjectId;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String)
	messageText: string;

	@Field(() => String)
	messageStatus: string;

	@Field(() => [String], { nullable: true })
	attachments?: string[];

	@Field(() => Date, { nullable: true })
	createdAt?: Date;
}

@ObjectType()
export class Messages {
	@Field(() => [Message])
	list: Message[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter?: TotalCounter[];
}

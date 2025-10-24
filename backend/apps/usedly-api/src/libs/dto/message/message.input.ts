import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';
import { availableMessagesSorts } from '../../config';

@InputType()
export class MessageInput {
	@IsNotEmpty()
	@Field(() => String)
	chatRoomId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	senderId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	receiverId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	messageText: string;

	@IsNotEmpty()
	@Field(() => String)
	messageStatus: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	attachments?: ObjectId;
}

@InputType()
class MMISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	chatRoomId?: ObjectId;
}

@InputType()
export class MessagesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableMessagesSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => MMISearch)
	search: MMISearch;
}

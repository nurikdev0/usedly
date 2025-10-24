import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class ChatRoom {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	propertyId: ObjectId;

	@Field(() => String)
	sellerId: ObjectId;

	@Field(() => String)
	buyerId: ObjectId;

	@Field(() => String, { nullable: true })
	lastMessage?: string;
}

@ObjectType()
export class ChatRooms {
	@Field(() => [ChatRoom])
	list: ChatRoom[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter?: TotalCounter[];
}

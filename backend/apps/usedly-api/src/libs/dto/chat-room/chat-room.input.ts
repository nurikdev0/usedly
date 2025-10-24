import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';
import { availableMessagesSorts } from '../../config';

@InputType()
export class ChatRoomInput {
	@IsNotEmpty()
	@Field(() => String)
	propertyId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	sellerId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	buyerId: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	lastMessage?: string;
}

@InputType()
class ChISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	propertyId?: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	sellerId?: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	buyerId?: ObjectId;
}

@InputType()
export class ChatRoomsInquiry {
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
	@Field(() => ChISearch)
	search: ChISearch;
}

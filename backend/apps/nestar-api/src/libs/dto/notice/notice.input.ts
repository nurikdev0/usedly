import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { availablePropertySorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { NoticeCategory, NoticeGroup } from '../../enums/notice.enum';

@InputType()
export class NoticeInput {
	@IsNotEmpty()
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@IsOptional()
	@Field(() => NoticeGroup, { nullable: true })
	noticeGroup?: NoticeGroup;

	@IsOptional()
	@Field(() => String, { nullable: true })
	noticeStatus?: string;

	@IsNotEmpty()
	@Field(() => String)
	@Length(3, 100)
	noticeTitle: string;

	@IsNotEmpty()
	@Field(() => String)
	noticeContent: string;

	memberId?: ObjectId;
}

@InputType()
export class NoticeInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePropertySorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;
}

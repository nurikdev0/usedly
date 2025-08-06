import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { ObjectId } from 'mongoose';
import { NoticeCategory, NoticeGroup } from '../../enums/notice.enum';

@InputType()
export class NoticeUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;
	@IsNotEmpty()
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@IsNotEmpty()
	@Field(() => NoticeGroup)
	noticeGroup: NoticeGroup;

	@IsNotEmpty()
	@Field(() => String)
	noticeStatus: string;

	@IsNotEmpty()
	@Field(() => String)
	@Length(3, 100)
	noticeTitle: string;

	@IsNotEmpty()
	@Field(() => String)
	noticeContent: string;
}

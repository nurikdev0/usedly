import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { ObjectId } from 'mongoose';
import { NotificationStatus } from '../../enums/notification.enum';

@InputType()
export class NotificationUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsNotEmpty()
	@Field(() => NotificationStatus)
	notificationStatus: NotificationStatus;
}

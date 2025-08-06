import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { NotificationsInquiry } from '../../libs/dto/notification/notification.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(AuthGuard)
	@Query(() => Notifications)
	public async getNotifications(
		@Args('input') input: NotificationsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notifications> {
		console.log('Query: getNotifications');
		return await this.notificationService.getNotifications(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Notification)
	public async updateNotification(
		@Args('input') input: NotificationUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notification> {
		console.log('Mutation: updateNotification');
		return await this.notificationService.updateNotification(memberId, input);
	}
}

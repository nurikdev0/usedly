import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NotificationInput, NotificationsInquiry } from '../../libs/dto/notification/notification.input';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { lookupMember } from '../../libs/config';
import { T } from '../../libs/types/common';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

	public async createNotification(input: NotificationInput): Promise<void> {
		try {
			await this.notificationModel.create(input);
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getNotifications(memberId: ObjectId, input: NotificationsInquiry): Promise<Notifications> {
		const match = {
			receiverId: memberId,
			notificationStatus: NotificationStatus.WAIT,
		};
		const sort = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};
		const result = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// Optionally include additional stages like:
							// { $match: { isLiked: true } },
							{
								$lookup: {
									from: 'members',
									localField: 'authorId',
									foreignField: '_id',
									as: 'memberData',
								},
							},
							{ $unwind: '$memberData' },

							{
								$lookup: {
									from: 'properties',
									localField: 'propertyId',
									foreignField: '_id',
									as: 'propertyData',
								},
							},
							{ $unwind: { path: '$propertyData', preserveNullAndEmptyArrays: true } },

							{
								$lookup: {
									from: 'boardArticles',
									localField: 'articleId',
									foreignField: '_id',
									as: 'articleData',
								},
							},
							{ $unwind: { path: '$articleData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		return result[0];
	}

	public async updateNotification(memberId: ObjectId, input: NotificationUpdate): Promise<Notification> {
		const search: T = {
			notificationStatus: NotificationStatus.WAIT,
			receiverId: memberId,
			_id: input._id,
		};

		const result = await this.notificationModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}
}

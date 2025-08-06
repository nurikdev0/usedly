import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { PropertyService } from '../property/property.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { T } from '../../libs/types/common';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { Property } from '../../libs/dto/property/property';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { NotificationService } from '../notification/notification.service';
import { BoardArticle } from '../../libs/dto/board-article/board-article';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { Member } from '../../libs/dto/member/member';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModel: Model<Comment>,
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		@InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private readonly memberService: MemberService,
		private readonly propertyService: PropertyService,
		private readonly boardArticleService: BoardArticleService,
		private notificationService: NotificationService,
	) {}

	public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
		input.memberId = memberId;

		let result = null;
		try {
			result = await this.commentModel.create(input);
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}

		switch (input.commentGroup) {
			case CommentGroup.PROPERTY:
				await this.propertyService.propertyStatsEditor({
					_id: input.commentRefId,
					targetKey: 'propertyComments',
					modifier: 1,
				});
				await this.propertyNotification(memberId, input);
				break;

			case CommentGroup.ARTICLE:
				await this.boardArticleService.boardArticleStatsEditor({
					_id: input.commentRefId,
					targetKey: 'articleComments',
					modifier: 1,
				});
				await this.articleNotification(memberId, input);
				break;

			case CommentGroup.MEMBER:
				await this.memberService.memberStatsEditor({
					_id: input.commentRefId,
					targetKey: 'memberComments',
					modifier: 1,
				});
				await this.memberNotification(memberId, input);
				break;
		}

		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
		return result;
	}

	private async propertyNotification(memberId: ObjectId, input: CommentInput): Promise<void> {
		const targetProperty: Property = await this.propertyModel
			.findOne({ _id: input.commentRefId, propertyStatus: PropertyStatus.ACTIVE })
			.exec();

		const inputNotification: NotificationInput = {
			notificationType: NotificationType.COMMENT,
			notificationStatus: NotificationStatus.WAIT,
			notificationGroup: NotificationGroup.PROPERTY,
			notificationTitle: 'commented on your product',
			authorId: memberId,
			receiverId: targetProperty.memberId,
			propertyId: input.commentRefId,
		};
		await this.notificationService.createNotification(inputNotification);
	}

	private async articleNotification(memberId: ObjectId, input: CommentInput): Promise<void> {
		const targetArticle: BoardArticle = await this.boardArticleModel
			.findOne({ _id: input.commentRefId, articleStatus: BoardArticleStatus.ACTIVE })
			.exec();

		const inputNotification: NotificationInput = {
			notificationType: NotificationType.COMMENT,
			notificationStatus: NotificationStatus.WAIT,
			notificationGroup: NotificationGroup.ARTICLE,
			notificationTitle: 'commented on your article',
			authorId: memberId,
			receiverId: targetArticle.memberId,
			articleId: input.commentRefId,
		};
		await this.notificationService.createNotification(inputNotification);
	}

	private async memberNotification(memberId: ObjectId, input: CommentInput): Promise<void> {
		const inputNotification: NotificationInput = {
			notificationType: NotificationType.COMMENT,
			notificationStatus: NotificationStatus.WAIT,
			notificationGroup: NotificationGroup.MEMBER,
			notificationTitle: 'commented on your profile',
			authorId: memberId,
			receiverId: input.commentRefId,
		};
		await this.notificationService.createNotification(inputNotification);
	}

	public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
		const { _id } = input;
		const result = await this.commentModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					commentStatus: CommentStatus.ACTIVE,
				},
				input,
				{
					new: true,
				},
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
		const { commentRefId } = input.search;
		const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result: Comments[] = await this.commentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// meLiked
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
		const result = await this.commentModel.findByIdAndDelete(input);
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}
}

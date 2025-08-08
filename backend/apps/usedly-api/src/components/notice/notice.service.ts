import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Property } from '../../libs/dto/property/property';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NoticeInput } from '../../libs/dto/notice/notice.input';
import { AllNoticesInquiry, Notice, Notices } from '../../libs/dto/notice/notice';
import { T } from '../../libs/types/common';

@Injectable()
export class NoticeService {
	constructor(@InjectModel('Notice') private readonly noticeModel: Model<Notice>) {}

	public async getNotices(input: AllNoticesInquiry): Promise<Notices> {
		const { noticeCategory, noticeGroup } = input.search;

		const match: T = {};
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};
		if (noticeCategory) {
			match.noticeCategory = noticeCategory;
		}
		if (noticeGroup) {
			match.noticeGroup = noticeGroup;
		}

		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
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

	public async createNoticeByAdmin(input: NoticeInput): Promise<Notice> {
		try {
			const result = await this.noticeModel.create(input);
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getAllNoticesByAdmin(input: AllNoticesInquiry): Promise<Notices> {
		const { noticeCategory, noticeGroup } = input.search;

		const match: T = {};
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};
		if (noticeCategory) {
			match.noticeCategory = noticeCategory;
		}
		if (noticeGroup) {
			match.noticeGroup = noticeGroup;
		}

		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
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

	public async removeNoticeByAdmin(propertyId: ObjectId): Promise<Notice> {
		const search: T = {
			_id: propertyId,
		};
		const result = await this.noticeModel.findOneAndDelete(search).exec();
		if (!result) {
			throw new InternalServerErrorException(Message.REMOVE_FAILED);
		}

		return result;
	}
}

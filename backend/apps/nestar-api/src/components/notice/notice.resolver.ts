import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { NoticeService } from './notice.service';
import { NoticeInput } from '../../libs/dto/notice/notice.input';
import { AllNoticesInquiry, Notice, Notices } from '../../libs/dto/notice/notice';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class NoticeResolver {
	constructor(private readonly noticeService: NoticeService) {}

	@UseGuards(WithoutGuard)
	@Query(() => Notices)
	public async getNotices(@Args('input') input: AllNoticesInquiry): Promise<Notices> {
		console.log('Query: getNotices');
		return await this.noticeService.getNotices(input);
	}

	// Admin

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	public async createNoticeByAdmin(
		@Args('input') input: NoticeInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Mutation: createNoticeByAdmin');
		input.memberId = memberId;
		return await this.noticeService.createNoticeByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Notices)
	public async getAllNoticesByAdmin(@Args('input') input: AllNoticesInquiry): Promise<Notices> {
		console.log('Query: getNotices');
		return await this.noticeService.getAllNoticesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	public async removeNoticeByAdmin(@Args('noticeId') input: string): Promise<Notice> {
		console.log('Mutation: removeNoticeByAdmin');
		const propertyId = shapeIntoMongoObjectId(input);
		return await this.noticeService.removeNoticeByAdmin(propertyId);
	}
}

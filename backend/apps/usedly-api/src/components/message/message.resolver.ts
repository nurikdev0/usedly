import { Args, Query, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Messages } from '../../libs/dto/message/message';
import { MessagesInquiry } from '../../libs/dto/message/message.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';

@Resolver()
export class MessageResolver {
	constructor(private readonly messageService: MessageService) {}

	@UseGuards(AuthGuard)
	@Query(() => Messages)
	public async getMessages(
		@Args('input') input: MessagesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Messages> {
		console.log('Query: getMessages');
		return await this.messageService.getMessages(memberId, input);
	}
}

import { Direction } from '../../enums/common.enum';

export interface MessageInput {
	chatRoomId: string;
	senderId: string;
	receiverId: string;
	messageText: string;
	messageStatus: string;
	attachments?: string[];
}

interface MMISearch {
	chatRoomId?: string;
}

export interface MessagesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: MMISearch;
}

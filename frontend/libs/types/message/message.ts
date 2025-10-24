export interface Message {
	_id: string;
	chatRoomId: string;
	senderId: string;
	receiverId: string;
	messageText: string;
	messageStatus?: string;
	attachments?: string[];
	createdAt?: Date;
}

export interface Messages {
	list: Message[];
}

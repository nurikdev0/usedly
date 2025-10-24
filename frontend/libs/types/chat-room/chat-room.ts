export interface TotalCounter {
	total: number;
}

export interface ChatRoom {
	_id: string;
	propertyId: string;
	sellerId: string;
	buyerId: string;
	lastMessage?: string;
}

export interface ChatRooms {
	list: ChatRoom[];
	metaCounter?: TotalCounter[];
}

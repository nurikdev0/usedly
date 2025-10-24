import { Direction } from '../../enums/common.enum';

interface ChISearch {
	propertyId?: string;
	sellerId?: string;
	buyerId?: string;
}

export interface ChatRoomsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ChISearch;
}

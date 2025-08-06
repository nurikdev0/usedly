import { NoticeCategory, NoticeGroup } from '../../enums/notice.enum';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeGroup?: NoticeGroup;
	noticeStatus?: string;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notices {
	list: Notice[];
	metaCounter: TotalCounter[];
}

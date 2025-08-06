import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';
import { NoticeCategory, NoticeGroup, NoticeStatus } from '../../enums/notice.enum';

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeGroup?: NoticeGroup;
	noticeStatus?: string;
	noticeTitle: string;
	noticeContent: string;
	memberId?: string;
}

interface ALNISearch {
	noticeStatus?: NoticeStatus;
	noticeGroup?: NoticeGroup;
}

export interface AllNoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALNISearch;
}

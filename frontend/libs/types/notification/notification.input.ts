import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';
import { NoticeCategory, NoticeGroup, NoticeStatus } from '../../enums/notice.enum';

export interface AllNotificationsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
}

import { NoticeCategory, NoticeGroup } from '../../enums/notice.enum';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { BoardArticle } from '../board-article/board-article';
import { Member } from '../member/member';
import { Property } from '../property/property';

export interface TotalCounter {
	total: number;
}

export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	authorId: string;
	receiverId?: string;
	propertyId?: string;
	articleId?: string;
	createdAt: string;
	updatedAt: string;
	memberData?: Member;
	propertyData?: Property;
	articleData?: BoardArticle;
}

export interface Notifications {
	list: Notification[];
	metaCounter?: TotalCounter[];
}

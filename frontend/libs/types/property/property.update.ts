import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyType?: PropertyType;
	propertyStatus?: PropertyStatus;
	propertyLocation?: PropertyLocation;
	propertyAddress?: string;
	propertyTitle?: string;
	propertyBrand?: string;
	propertyModel?: string;
	propertyPrice?: number;
	propertyImages?: string[];
	propertyDesc?: string;
	soldAt?: Date;
	deletedAt?: Date;
}

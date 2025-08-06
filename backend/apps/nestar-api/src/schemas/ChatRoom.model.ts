import { Schema } from 'mongoose';

const ChatRoomSchema = new Schema(
	{
		propertyId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Property',
		},

		sellerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		buyerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		lastMessage: {
			type: String,
		},
	},
	{ timestamps: true, collection: 'chatRooms' },
);

ChatRoomSchema.index({ propertyId: 1, sellerId: 1, buyerId: 1 }, { unique: true });

export default ChatRoomSchema;

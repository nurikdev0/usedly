import { Schema } from 'mongoose';
import { Message } from '../libs/enums/message.enum';

const MessageSchema = new Schema(
	{
		chatRoomId: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		senderId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		receiverId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		messageText: {
			type: String,
			require: true,
		},

		messageStatus: {
			type: String,
			require: true,
			enum: Message,
			default: Message.SENT,
		},

		attachments: {
			type: [String],
		},
	},
	{ timestamps: true, collection: 'Messages' },
);

export default MessageSchema;

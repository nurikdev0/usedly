import { registerEnumType } from '@nestjs/graphql';

export enum Message {
	SENT = 'SENT',
	DELIVERED = 'DELIVERED',
	READ = 'READ',
}
registerEnumType(Message, {
	name: 'Message',
});

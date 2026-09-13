import { Document, Types } from 'mongoose';
import { User } from 'src/users/interfaces/user.interface';
import { Conversation } from './conversation.interface';

export interface Attachment {
  type: 'image' | 'document' | 'audio';
  url: string;
}

export interface Message extends Document {
  readonly _id: Types.ObjectId;
  readonly conversationId: Types.ObjectId | Conversation;
  readonly sender: Types.ObjectId | User;
  readonly receiver: Types.ObjectId | User;
  content: string;
  attachments?: Attachment[];
  isRead: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

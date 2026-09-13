import { Document, Types } from 'mongoose';
import { User } from 'src/users/interfaces/user.interface';
import { Message } from './message.interface';


export interface UnreadCount {
  doctor: number;
  patient: number;
}

export interface Conversation extends Document {
  readonly _id: Types.ObjectId;
  readonly participants: Types.ObjectId[] | User[];
  readonly doctor: Types.ObjectId | User;
  readonly patient: Types.ObjectId | User;
  lastMessage?: Types.ObjectId | Message | null;
  unreadCount: UnreadCount;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
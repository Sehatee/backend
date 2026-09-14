import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Conversation } from './interfaces/conversation.interface';
import { Message } from './interfaces/message.interface';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject('MESSAGE_MODEL')
    private readonly messageModel: Model<Message>,
    @Inject('CONVERSATION_MODEL')
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async createConversation(doctorId: string, patientId: string) {
    const conversation = await this.conversationModel.create({
      doctor: new Types.ObjectId(doctorId),
      patient: new Types.ObjectId(patientId),
      participants: [doctorId, patientId],
    });

    return conversation.populate(
      'doctor patient',
      'username specialization picture',
    );
  }

  async getAllConversations(userId: string, role: string) {
    const conversations = await this.conversationModel
      .find({
        [role]: new Types.ObjectId(userId),
      })
      .populate('doctor patient', 'username specialization picture');
    if (!conversations) {
      throw new HttpException('this conv is not found', HttpStatus.BAD_REQUEST);
    }

    return conversations;
  }
  // replce this by (getConversation , createConversation)
  async getOrCreateConversation(
    doctorId: string,
    patientId: string,
  ): Promise<Conversation> {
    let conversation = await this.conversationModel.findOne({
      doctor: new Types.ObjectId(doctorId),
      patient: new Types.ObjectId(patientId),
    });

    if (!conversation) {
      conversation = await this.conversationModel.create({
        doctor: doctorId,
        patient: patientId,
        participants: [doctorId, patientId],
      });
    }

    return conversation;
  }
  async getConversation(doctorId: string, patientId: string) {
    const conversation = await this.conversationModel.findOne({
      doctor: new Types.ObjectId(doctorId),
      patient: new Types.ObjectId(patientId),
    });
    if (!conversation) {
      throw new HttpException('this conv is not found', HttpStatus.BAD_REQUEST);
    }
    return conversation;
  }

  async saveMessage(dto: SendMessageDto): Promise<Message> {
    const conversation = await this.getOrCreateConversation(
      dto.doctorId,
      dto.patientId,
    );
    const newMessage = await this.messageModel.create({
      conversationId: conversation._id,
      sender: dto.senderId,
      receiver: dto.receiverId,
      content: dto.content || '',
      attachments: dto.attachments,
    });

    // تحديد المائل المستلم لتحديث الـ unreadCount
    const isReceiverDoctor = dto.receiverId === dto.doctorId;
    const unreadField = isReceiverDoctor
      ? 'unreadCount.doctor'
      : 'unreadCount.patient';

    // تحديث المحادثة بآخر رسالة وزيادة عداد غير المقروء
    await this.conversationModel.findByIdAndUpdate(conversation._id, {
      lastMessage: newMessage._id,
      $inc: { [unreadField]: 1 },
    });

    return newMessage.populate('sender receiver', 'username picture role');
  }

  async getMessages(conversationId: string, limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    const messages = await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender receiver', 'username picture role');

    const total = await this.messageModel.countDocuments({ conversationId });

    return {
      messages: messages.reverse(), // لإرجاعها بالترتيب الزمني الصحيح للعميل
      page,
      pages: Math.ceil(total / limit),
      total,
    };
  }

  async markAsRead(
    conversationId: string,
    userId: string,
    role: 'doctor' | 'patient',
  ) {
    const unreadField =
      role === 'doctor' ? 'unreadCount.doctor' : 'unreadCount.patient';

    await this.conversationModel.findByIdAndUpdate(conversationId, {
      $set: { [unreadField]: 0 },
    });

    await this.messageModel.updateMany(
      { conversationId, receiver: userId, isRead: false },
      { $set: { isRead: true } },
    );

    return { success: true };
  }
  // chat.service.ts

  async getConversationWithMessages(
    doctorId: string,
    patientId: string,
    limit = 50,
    page = 1,
  ) {
    // 1. Get or create conversation document
    const conversation = await this.getOrCreateConversation(
      doctorId,
      patientId,
    );

    // 2. Fetch paginated history messages
    const messagesData = await this.getMessages(
      conversation._id.toString(),
      limit,
      page,
    );

    return {
      conversationId: conversation._id,
      participants: conversation.participants,
      unreadCount: conversation.unreadCount,
      ...messagesData,
    };
  }
}

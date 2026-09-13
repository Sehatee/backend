export class SendMessageDto {
  senderId: string;
  receiverId: string;
  doctorId: string;
  patientId: string;
  content: string;
  attachments?: { type: 'image' | 'document' | 'audio'; url: string }[];
}

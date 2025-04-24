import { IsString, IsBoolean, IsDate } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  message: string;

  @IsBoolean()
  isRead: boolean;
}

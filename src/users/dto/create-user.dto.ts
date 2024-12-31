import { IsEmail, IsEnum, IsPhoneNumber, IsString } from 'class-validator';

export class createUserDto {
  @IsString()
  username: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  confirmPassword: string;
  @IsEnum(['admin', 'doctor', 'patient'])
  role: ['admin', 'doctor', 'patient'];
  // @IsPhoneNumber('AL')// ممكن تتغير
  @IsString()
  phone: string;
  @IsString()
  picture: string;
  @IsString()
  specialization: string; // ? only if user is doctor
}

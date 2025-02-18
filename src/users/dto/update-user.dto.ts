import {
  isArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

interface Location {
  type: string;
  coordinates: number[];
  addrss: string;
}
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;
  @IsString()
  @IsOptional()
  password: string;
  @IsString()
  @IsOptional()
  confirmPassword: string;
  @IsEnum(['admin', 'doctor', 'patient'])
  @IsOptional()
  role: 'admin' | 'doctor' | 'patient';
  // @IsPhoneNumber('AL')// ممكن تتغير
  @IsString()
  @IsOptional()
  phone: string;
  @IsString()
  @IsOptional()
  picture: string;
  @IsString()
  @IsOptional()
  specialization: string; // ? only if user is doctor
  location: number;
}

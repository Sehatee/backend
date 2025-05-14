import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class Location {
  @IsString()
  type: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  coordinates: number[];

  @IsString()
  addrss: string;
}
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
  role: 'admin' | 'doctor' | 'patient';
  // @IsPhoneNumber('AL')// ممكن تتغير
  @IsString()
  phone: string;
  @IsString()
  description: string;
  @IsString()
  picture: string;
  @IsString()
  specialization: string; // ? only if user is doctor
  @ValidateNested()
  @Type(() => Location)
  location: Location;
  @IsBoolean()
  active: boolean;
}

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  isArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

type availableHours = {
  day: string;
};
export class Location {
  @IsString()
  @IsOptional()
  type: string = 'Point'; // يجب أن يكون "Point" عند استخدام GeoJSON

  @IsArray()
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true }) // التأكد من أن كل عنصر في المصفوفة رقم
  @Min(-180, { each: true }) // الحد الأدنى للإحداثيات
  @Max(180, { each: true }) // الحد الأقصى للإحداثيات
  coordinates: number[];

  @IsString()
  @IsOptional()
  address: string; // تصحيح الاسم من `addrss` إلى `address`
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
  description: string;
  @IsString()
  @IsOptional()
  picture: string;
  @IsString()
  @IsOptional()
  specialization: string; // ? only if user is doctor
  @ValidateNested()
  @Type(() => Location)
  location: Location;
  @IsBoolean()
  @IsOptional()
  active: boolean;
  @IsOptional()
  availableHours: availableHours[];
}

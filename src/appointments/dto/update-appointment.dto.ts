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
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class Location {
  @IsString()
  type: string = 'Point'; // يجب أن يكون "Point" عند استخدام GeoJSON

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true }) // التأكد من أن كل عنصر في المصفوفة رقم
  @Min(-180, { each: true }) // الحد الأدنى للإحداثيات
  @Max(180, { each: true }) // الحد الأقصى للإحداثيات
  coordinates: number[];

  @IsString()
  address: string; // تصحيح الاسم من `addrss` إلى `address`
}
export class UpdateUserDto {
  @IsOptional()
  appointments: string[];
}

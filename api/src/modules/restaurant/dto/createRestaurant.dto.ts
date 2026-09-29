import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(255)
  description: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  address: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  cuisineType: string;

}

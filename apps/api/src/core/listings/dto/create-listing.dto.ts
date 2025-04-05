import {
  IsBoolean,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  isDraft: boolean;

  @ApiProperty({
    minLength: 2,
    maxLength: 128,
    example: 'BMW M3 E30 Sport Evolution',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  title: string;

  @ApiProperty({
    maxLength: 2048,
    example:
      'The BMW M3 E30 Sport Evolution is a limited edition of the E30 M3,' +
      ' produced in 1990. It features a more powerful engine and a lightweight ' +
      'design, making it a true performance car.',
  })
  @IsString()
  @MinLength(50)
  @MaxLength(2048)
  description: string;

  @ApiProperty({
    example: 7170000,
  })
  @IsInt()
  @Min(1)
  price: number;
}

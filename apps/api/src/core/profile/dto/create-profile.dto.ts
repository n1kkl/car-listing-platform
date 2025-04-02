import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 128,
    example: 'John Doe',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  displayName: string;
}

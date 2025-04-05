import { IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
  @ApiProperty({
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Max(100)
  @Min(1)
  limit: number = 10;
}

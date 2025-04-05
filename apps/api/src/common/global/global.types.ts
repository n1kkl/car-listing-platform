import { ApiProperty } from '@nestjs/swagger';

export class Paginated<E> {
  @ApiProperty({ type: [Object] })
  items: E[];

  @ApiProperty({ example: 172 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

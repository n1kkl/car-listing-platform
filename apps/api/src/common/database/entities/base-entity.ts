import { PrimaryKey, Property } from '@mikro-orm/core';
import { createId } from '@paralleldrive/cuid2';
import { ApiProperty } from '@nestjs/swagger';

type Options = {
  idPrefix?: string;
};

export class BaseEntity {
  private readonly idPrefix?: string;

  constructor(options: Options = {}) {
    this.idPrefix = options.idPrefix;
  }

  @ApiProperty({ example: 'cid_cm94dt8w000000cl28g575iu5' })
  @PrimaryKey({ onCreate: (e: BaseEntity) => e.generateId() })
  id: string;

  @ApiProperty({ example: '2024-04-05T17:42:34Z' })
  @Property()
  createdAt: Date = new Date();

  @ApiProperty({ example: '2024-04-05T18:31:03Z' })
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  private generateId() {
    const id = createId();
    return this.idPrefix ? `${this.idPrefix}_${id}` : id;
  }
}

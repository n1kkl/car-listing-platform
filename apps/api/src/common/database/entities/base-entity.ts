import { PrimaryKey, Property } from '@mikro-orm/core';
import { createId } from '@paralleldrive/cuid2';

type Options = {
  idPrefix?: string;
};

export class BaseEntity {
  private readonly idPrefix?: string;

  constructor(options: Options = {}) {
    this.idPrefix = options.idPrefix;
  }

  @PrimaryKey({ onCreate: (e: BaseEntity) => e.generateId() })
  id: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  private generateId() {
    const id = createId();
    return this.idPrefix ? `${this.idPrefix}_${id}` : id;
  }
}

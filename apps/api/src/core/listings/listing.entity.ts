import { Entity, ManyToOne } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../common/database/entities/base-entity';
import { Profile } from '../profile/profile.entity';
import { ListingsRepository } from './listings.repository';
import { Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ repository: () => ListingsRepository })
export class Listing extends BaseEntity {
  constructor() {
    super({ idPrefix: 'lst' });
  }

  @ApiProperty({ type: () => Profile })
  @ManyToOne()
  owner: Profile;

  @ApiProperty({ example: true })
  @Property()
  isDraft: boolean;

  @ApiProperty({
    example: 'BMW M3 E30 Sport Evolution',
  })
  @Property({ type: 'text' })
  title: string;

  @ApiProperty({
    example:
      'The BMW M3 E30 Sport Evolution is a limited edition of the E30 M3,' +
      ' produced in 1990. It features a more powerful engine and a lightweight ' +
      'design, making it a true performance car.',
  })
  @Property({ type: 'text' })
  description: string;

  @ApiProperty({
    example: 7170000,
  })
  @Property({ type: 'int' })
  price: number;
}

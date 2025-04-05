import { BaseEntity } from '../../common/database/entities/base-entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ProfileRepository } from './profile.repository';
import { Listing } from '../listings/listing.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ repository: () => ProfileRepository })
export class Profile extends BaseEntity {
  constructor() {
    super({ idPrefix: 'pfl' });
  }

  [EntityRepositoryType]?: ProfileRepository;

  @ApiProperty({ example: 'John Doe' })
  @Property()
  displayName: string;

  @Property({ hidden: true })
  keycloakId: string;

  @OneToMany(() => Listing, (listing) => listing.owner)
  listings = new Collection<Listing>(this);
}

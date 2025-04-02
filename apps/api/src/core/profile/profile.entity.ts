import { BaseEntity } from '../../common/database/entities/base-entity';
import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { ProfileRepository } from './profile.repository';

@Entity({ repository: () => ProfileRepository })
export class Profile extends BaseEntity {
  constructor() {
    super({ idPrefix: 'pfl' });
  }

  [EntityRepositoryType]?: ProfileRepository;

  @Property()
  displayName: string;

  @Property({ hidden: true })
  keycloakId: string;
}

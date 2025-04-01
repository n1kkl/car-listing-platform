import { BaseEntity } from '../../common/database/entities/base-entity';
import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { ProfileRepository } from './profile.repository';

@Entity({ repository: () => ProfileRepository })
export class ProfileEntity extends BaseEntity {
  constructor() {
    super({ idPrefix: 'pfl' });
  }

  [EntityRepositoryType]?: ProfileRepository;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property()
  email: string;

  @Property()
  username: string;
}

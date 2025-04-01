import { EntityRepository } from '@mikro-orm/postgresql';
import { ProfileEntity } from './profile.entity';

export class ProfileRepository extends EntityRepository<ProfileEntity> {}

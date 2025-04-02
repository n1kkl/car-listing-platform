import { EntityRepository } from '@mikro-orm/postgresql';
import { Profile } from './profile.entity';

export class ProfileRepository extends EntityRepository<Profile> {}

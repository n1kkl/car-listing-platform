import { EntityRepository } from '@mikro-orm/postgresql';
import { Listing } from './listing.entity';

export class ListingsRepository extends EntityRepository<Listing> {}

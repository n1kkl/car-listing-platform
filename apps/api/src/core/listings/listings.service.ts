import { EntityService } from '../../common/database/entity.service';
import { Listing } from './listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingsRepository } from './listings.repository';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { I18nService } from '../../common/global/services/i18n.service';
import { Context } from '../../common/global/context';
import { ProfileService } from '../profile/profile.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListingsService extends EntityService<
  Listing,
  CreateListingDto,
  UpdateListingDto
> {
  constructor(
    private readonly profileService: ProfileService,
    private readonly listingRepository: ListingsRepository,
    private readonly em: EntityManager,
    private readonly i18n: I18nService,
  ) {
    super(Listing, em, listingRepository, i18n, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      populate: ['owner'],
    });
  }

  async applyCreate(
    listing: Listing,
    createListingDto: CreateListingDto,
    ctx: Context,
  ): Promise<void> {
    const profile = await this.profileService.current(ctx);
    this.em.assign(listing, {
      ...createListingDto,
      owner: profile.id,
    });
  }

  async applyUpdate(
    listing: Listing,
    updateListingDto: UpdateListingDto,
    ctx: Context,
  ): Promise<void> {
    const profile = await this.profileService.current(ctx);
    this.em.assign(listing, {
      ...updateListingDto,
      owner: profile.id,
    });
  }

  protected async applyDefaultFilter(
    query: FilterQuery<Listing>,
    ctx: Context,
  ): Promise<void> {
    const profile = await this.profileService.currentOrNull(ctx);
    const filters: FilterQuery<Listing>[] = [{ isDraft: false }];
    if (profile) {
      filters.push({ isDraft: true, owner: profile.id });
    }
    query['$or'] = filters;
  }

  protected async applyDefaultWriteFilter(
    query: FilterQuery<Listing>,
    ctx: Context,
  ): Promise<void> {
    const profile = await this.profileService.current(ctx);
    query['owner'] = profile.id;
  }
}

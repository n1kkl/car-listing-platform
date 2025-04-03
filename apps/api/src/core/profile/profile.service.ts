import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { Context } from '../../common/global/context';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { I18nService } from '../../common/global/services/i18n.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly em: EntityManager,
    private readonly i18n: I18nService,
  ) {}

  async currentOrFail(ctx: Context): Promise<Profile> {
    if (!ctx.user) {
      throw new BadRequestException(this.i18n.t('errors.user.notFound'));
    }

    return this.retrieve(this.getContextQuery(ctx), ctx);
  }

  async retrieve(query: FilterQuery<Profile>, ctx: Context): Promise<Profile> {
    return this.profileRepository.findOneOrFail(
      this.getContextQuery(ctx, query),
      {
        failHandler: () =>
          new NotFoundException(this.i18n.t('errors.profile.notFound')),
      },
    );
  }

  async create(
    createProfileDto: CreateProfileDto,
    ctx: Context,
  ): Promise<Profile> {
    const user = ctx.getUserOrThrow();
    const existing = await this.profileRepository.findOne(
      this.getContextQuery(ctx),
    );
    if (existing) {
      throw new BadRequestException(
        this.i18n.t('errors.profile.alreadyExists'),
      );
    }

    const profile = this.profileRepository.create({
      ...createProfileDto,
      keycloakId: user.sub,
    });

    await this.em.persistAndFlush(profile);
    this.em.clear();

    return this.retrieve({ id: profile.id }, ctx);
  }

  async update(
    query: FilterQuery<Profile>,
    updateProfileDto: UpdateProfileDto,
    ctx: Context,
  ): Promise<Profile> {
    const profile = await this.retrieve(query, ctx);

    this.profileRepository.assign(profile, updateProfileDto);
    await this.em.persistAndFlush(profile);
    this.em.clear();

    return this.retrieve(query, ctx);
  }

  async delete(query: FilterQuery<Profile>, ctx: Context): Promise<Profile> {
    const profile = await this.retrieve(query, ctx);
    await this.em.removeAndFlush(profile);

    return profile;
  }

  getContextQuery(
    ctx: Context,
    query: FilterQuery<Profile> = {},
  ): FilterQuery<Profile> {
    if (!ctx.user) {
      throw new BadRequestException(this.i18n.t('errors.user.notFound'));
    }
    query['keycloakId'] = ctx.user.sub;

    return query;
  }
}

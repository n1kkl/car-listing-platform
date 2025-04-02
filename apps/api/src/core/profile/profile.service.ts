import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { Context } from '../../common/global/context';
import { I18nService } from 'nestjs-i18n';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly em: EntityManager,
    private readonly i18n: I18nService,
  ) {}

  async retrieve(query: FilterQuery<Profile>, ctx: Context): Promise<Profile> {
    return this.profileRepository.findOneOrFail(query, {
      failHandler: () =>
        new NotFoundException(
          this.i18n.t('errors.entity.notFound', {
            lang: ctx.lang,
            args: { entity: 'User' },
          }),
        ),
      populate: [],
    });
  }

  async create(
    createProfileDto: CreateProfileDto,
    ctx: Context,
  ): Promise<Profile> {
    if (!ctx.user) {
      throw new BadRequestException(
        this.i18n.t('errors.entity.notFound', {
          lang: ctx.lang,
          args: { entity: 'User' },
        }),
      );
    }

    const existing = await this.profileRepository.findOne({
      keycloakId: ctx.user.sub,
    });
    if (existing) {
      throw new BadRequestException(
        this.i18n.t('errors.profile.alreadyExists', {
          lang: ctx.lang,
        }),
      );
    }

    const profile = this.profileRepository.create({
      ...createProfileDto,
      keycloakId: ctx.user.sub,
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
    if (profile.keycloakId !== ctx.user?.sub) {
      throw new ForbiddenException(
        this.i18n.t('errors.profile.forbidden', {
          lang: ctx.lang,
        }),
      );
    }

    this.profileRepository.assign(profile, updateProfileDto);
    await this.em.persistAndFlush(profile);
    this.em.clear();

    return this.retrieve(query, ctx);
  }

  async delete(query: FilterQuery<Profile>, ctx: Context): Promise<Profile> {
    const profile = await this.retrieve(query, ctx);
    if (profile.keycloakId !== ctx.user?.sub) {
      throw new ForbiddenException(
        this.i18n.t('errors.profile.forbidden', {
          lang: ctx.lang,
        }),
      );
    }

    await this.em.removeAndFlush(profile);

    return profile;
  }
}

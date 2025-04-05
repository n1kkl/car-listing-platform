import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { Context } from '../../common/global/context';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { I18nService } from '../../common/global/services/i18n.service';
import { EntityService } from '../../common/database/entity.service';

@Injectable()
export class ProfileService extends EntityService<
  Profile,
  CreateProfileDto,
  UpdateProfileDto
> {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly em: EntityManager,
    private readonly i18n: I18nService,
  ) {
    super(Profile, em, profileRepository, i18n);
  }

  async currentOrNull(ctx: Context): Promise<Profile | null> {
    return this.retrieveOrNull({ keycloakId: ctx.user?.sub }, ctx);
  }

  async current(ctx: Context): Promise<Profile> {
    return this.retrieve({ keycloakId: ctx.user?.sub }, ctx);
  }

  async checkCreate(dto: CreateProfileDto, ctx: Context): Promise<boolean> {
    const existingProfile = await this.retrieve(
      { keycloakId: ctx.user?.sub },
      ctx,
    );
    if (existingProfile) {
      throw new BadRequestException(
        this.i18n.t('errors.profile.alreadyExists'),
      );
    }
    return true;
  }

  async applyCreate(
    profile: Profile,
    createProfileDto: CreateProfileDto,
    ctx: Context,
  ): Promise<void> {
    this.em.assign(profile, {
      ...createProfileDto,
      keycloakId: ctx.user.sub,
    });
  }

  async applyUpdate(
    profile: Profile,
    updateProfileDto: UpdateProfileDto,
    ctx: Context,
  ): Promise<void> {
    this.em.assign(profile, {
      ...updateProfileDto,
      keycloakId: ctx.user.sub,
    });
  }

  async applyDefaultFilter(
    query: FilterQuery<Profile>,
    ctx: Context,
  ): Promise<void> {
    if (!ctx.user) {
      throw new BadRequestException(this.i18n.t('errors.user.notFound'));
    }
    query['keycloakId'] = ctx.user.sub;
  }
}

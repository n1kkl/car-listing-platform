import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Ctx } from '../../common/global/decorators/ctx.decorator';
import { Context } from '../../common/global/context';
import { ProfileService } from './profile.service';
import { Resource, Scopes } from 'nest-keycloak-connect';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
@Resource('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiBearerAuth()
  @Scopes('read')
  async current(@Ctx() ctx: Context) {
    return this.profileService.currentOrFail(ctx);
  }

  @Post()
  @ApiBearerAuth()
  @Scopes('write')
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Ctx() ctx: Context,
  ) {
    return this.profileService.create(createProfileDto, ctx);
  }

  @Patch()
  @ApiBearerAuth()
  @Scopes('write')
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @Ctx() ctx: Context,
  ) {
    return this.profileService.update(
      this.profileService.getContextQuery(ctx),
      updateProfileDto,
      ctx,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @Scopes('delete')
  async delete(@Ctx() ctx: Context) {
    return this.profileService.delete(
      this.profileService.getContextQuery(ctx),
      ctx,
    );
  }
}

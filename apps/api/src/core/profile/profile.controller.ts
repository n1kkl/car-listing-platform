import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOAuth2,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Ctx } from '../../common/global/decorators/ctx.decorator';
import { Context } from '../../common/global/context';
import { ProfileService } from './profile.service';
import { Resource, Scopes } from 'nest-keycloak-connect';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './profile.entity';

@Controller('profile')
@Resource('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOAuth2(['profile:read'])
  @ApiResponse({ type: () => Profile })
  @Scopes('read')
  async current(@Ctx() ctx: Context) {
    return this.profileService.current(ctx);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOAuth2(['profile:write'])
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({ type: () => Profile })
  @Scopes('write')
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Ctx() ctx: Context,
  ) {
    return this.profileService.create(createProfileDto, ctx);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOAuth2(['profile:write'])
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ type: () => Profile })
  @Scopes('write')
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @Ctx() ctx: Context,
  ) {
    return this.profileService.update(
      { keycloakId: ctx.user?.sub },
      updateProfileDto,
      ctx,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOAuth2(['profile:delete'])
  @ApiResponse({ type: () => Profile })
  @Scopes('delete')
  async delete(@Ctx() ctx: Context) {
    return this.profileService.delete({ keycloakId: ctx.user?.sub }, ctx);
  }
}

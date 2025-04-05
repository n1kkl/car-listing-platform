import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Pagination } from '../../common/global/dto/pagination.dto';
import { Paginated } from '../../common/global/global.types';
import { Listing } from './listing.entity';
import { Context } from '../../common/global/context';
import { Ctx } from '../../common/global/decorators/ctx.decorator';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Resource, Scopes } from 'nest-keycloak-connect';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOAuth2,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('listings')
@Resource('listing')
export class ListingsController {
  constructor(protected readonly listingsService: ListingsService) {}

  @Get()
  @Scopes('read')
  @ApiBearerAuth()
  @ApiOAuth2(['listings:read'])
  @ApiQuery({ type: Pagination })
  @ApiResponse({ type: Paginated<Listing> })
  async list(
    @Query() pagination: Pagination,
    @Ctx() ctx: Context,
  ): Promise<Paginated<Listing>> {
    return this.listingsService.paginate({}, pagination, ctx);
  }

  @Get(':id')
  @Scopes('read')
  @ApiBearerAuth()
  @ApiOAuth2(['listings:read'])
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ type: Listing })
  async retrieve(
    @Param('id') id: string,
    @Ctx() ctx: Context,
  ): Promise<Listing> {
    return this.listingsService.retrieve({ id }, ctx);
  }

  @Post()
  @Scopes('write')
  @ApiBearerAuth()
  @ApiOAuth2(['listings:write'])
  @ApiBody({ type: CreateListingDto })
  @ApiResponse({ type: Listing })
  async create(
    @Body() createListingDto: CreateListingDto,
    @Ctx() ctx: Context,
  ): Promise<Listing> {
    return this.listingsService.create(createListingDto, ctx);
  }

  @Patch(':id')
  @Scopes('write')
  @ApiBearerAuth()
  @ApiOAuth2(['listings:write'])
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateListingDto })
  @ApiResponse({ type: Listing })
  async update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
    @Ctx() ctx: Context,
  ): Promise<Listing> {
    return this.listingsService.update({ id }, updateListingDto, ctx);
  }

  @Delete(':id')
  @Scopes('delete')
  @ApiBearerAuth()
  @ApiOAuth2(['listings:delete'])
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ type: Listing })
  async delete(@Param('id') id: string, @Ctx() ctx: Context): Promise<Listing> {
    return this.listingsService.delete({ id }, ctx);
  }
}

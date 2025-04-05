import {
  EntityData,
  FromEntityType,
  IsSubset,
  Populate,
} from '@mikro-orm/core';
import { BaseEntity } from './entities/base-entity';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/postgresql';
import { ClassConstructor } from 'class-transformer';
import { Context } from '../global/context';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { I18nService } from '../global/services/i18n.service';
import { Pagination } from '../global/dto/pagination.dto';
import { Paginated } from '../global/global.types';

type EntityServiceOptions<E extends BaseEntity> = {
  populate?: Populate<E, string>;
};

export class EntityService<
  E extends BaseEntity,
  C extends IsSubset<EntityData<FromEntityType<E>, false>, any>,
  U extends IsSubset<EntityData<FromEntityType<E>, false>, any>,
> {
  constructor(
    private readonly entityClass: ClassConstructor<E>,
    private readonly entityManager: EntityManager,
    private readonly repository: EntityRepository<E>,
    private readonly translation: I18nService,
    private readonly options: EntityServiceOptions<E> = {},
  ) {}

  async retrieve(query: FilterQuery<E>, ctx: Context): Promise<E> {
    await this.applyDefaultFilter(query, ctx);
    return this.repository.findOneOrFail(query, {
      failHandler: () =>
        new NotFoundException(this.translation.t('errors.entity.notFound')),
      populate: this.options?.populate,
    });
  }

  async retrieveOrNull(query: FilterQuery<E>, ctx: Context): Promise<E | null> {
    await this.applyDefaultFilter(query, ctx);
    return this.repository.findOne(query, {
      populate: this.options?.populate,
    });
  }

  async list(query: FilterQuery<E>, ctx: Context): Promise<E[]> {
    await this.applyDefaultFilter(query, ctx);
    return this.repository.find(query, {
      populate: this.options?.populate,
    });
  }

  async paginate(
    query: FilterQuery<E>,
    pagination: Pagination,
    ctx: Context,
  ): Promise<Paginated<E>> {
    await this.applyDefaultFilter(query, ctx);
    const [items, total] = await this.repository.findAndCount(query, {
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      populate: this.options?.populate,
    });

    return { items, total, page: pagination.page, limit: pagination.limit };
  }

  async create(dto: C, ctx: Context): Promise<E> {
    const allowed = await this.checkCreate(dto, ctx);
    if (!allowed) {
      throw new ForbiddenException(
        this.translation.t('errors.action.forbidden'),
      );
    }

    const entity = new this.entityClass();
    await this.applyCreate(entity, dto, ctx);
    await this.entityManager.persistAndFlush(entity);
    return this.retrieve(entity, ctx);
  }

  async update(query: FilterQuery<E>, dto: U, ctx: Context): Promise<E> {
    await this.applyDefaultWriteFilter(query, ctx);
    const entity = await this.retrieve(query, ctx);
    const allowed = await this.checkUpdate(entity, dto, ctx);
    if (!allowed) {
      throw new ForbiddenException(
        this.translation.t('errors.action.forbidden'),
      );
    }

    await this.applyUpdate(entity, dto, ctx);
    await this.entityManager.persistAndFlush(entity);
    return this.retrieve(entity, ctx);
  }

  async delete(query: FilterQuery<E>, ctx: Context): Promise<E> {
    await this.applyDefaultWriteFilter(query, ctx);
    const entity = await this.retrieve(query, ctx);
    const allowed = await this.checkDelete(entity, ctx);
    if (!allowed) {
      throw new ForbiddenException(
        this.translation.t('errors.action.forbidden'),
      );
    }

    await this.entityManager.removeAndFlush(entity);
    return entity;
  }

  protected async checkDelete(entity: E, ctx: Context): Promise<boolean> {
    return true;
  }

  protected async checkCreate(dto: C, ctx: Context): Promise<boolean> {
    return true;
  }

  protected async checkUpdate(
    entity: E,
    dto: U,
    ctx: Context,
  ): Promise<boolean> {
    return true;
  }

  protected async applyCreate(entity: E, dto: C, ctx: Context): Promise<void> {
    this.entityManager.assign(entity, dto);
  }

  protected async applyUpdate(entity: E, dto: U, ctx: Context): Promise<void> {
    this.entityManager.assign(entity, dto);
  }

  protected async applyDefaultFilter(
    query: FilterQuery<E>,
    ctx: Context,
  ): Promise<void> {
    // do nothing
  }

  protected async applyDefaultWriteFilter(
    query: FilterQuery<E>,
    ctx: Context,
  ): Promise<void> {
    // do nothing
  }
}

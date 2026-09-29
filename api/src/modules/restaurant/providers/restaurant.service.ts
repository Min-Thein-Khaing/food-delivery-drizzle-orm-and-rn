import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { CreateRestaurantDto } from '../dto/createRestaurant.dto.js';
import { schema } from '../../../db/index.js';
import { and, asc, count, desc, eq, like, or, SQL } from 'drizzle-orm';
import { UpdateRestaurantDto } from '../dto/updateRestaurant.dto.js';
import { FindAllQuery } from '../interface/restaurant.interface.js';
import { PaginatedResponse } from '../../../common/responseTypeforPagination.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('DB')
    private readonly db: NeonHttpDatabase,
    private readonly configService: ConfigService,
  ) {}

  async create(ownerId: string, createRestaurantDto: CreateRestaurantDto) {
    const [existing] = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, ownerId));

    if (existing) {
      throw new ForbiddenException('You are already have a restaurant');
    }

    const [restaurant] = await this.db
      .insert(schema.restaurant)
      .values({
        ...createRestaurantDto,
        ownerId,
      })
      .returning();

    return restaurant;
  }

  async findAll(
    query: FindAllQuery = {},
  ): Promise<PaginatedResponse<typeof schema.restaurant.$inferSelect>> {
    // 1. Pagination Defaults (Default 10 items)
    const page = Number(query.page) || 1;
    const per_page = Number(query.per_page) || 10;
    const offset = (page - 1) * per_page; // Calculate the offset
    const limit = per_page;

    // 2. Build Where Conditions (Search & Multiple Filters)
    const filters: SQL[] = [];

    if (query.search) {
      filters.push(
        or(
          like(schema.restaurant.name, `%${query.search}%`),
          like(schema.restaurant.description, `%${query.search}%`),
        )!,
      );
    }

    //   // Filter 1: Status
    //   if (query.status) {
    //     filters.push(eq(schema.restaurant.status, query.status));
    //   }

    //   // Filter 2: Category ID
    //   if (query.category_id) {
    //     filters.push(eq(schema.restaurant.category_id, Number(query.category_id)));
    //   }
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    //3 sort and sortdirection
    const allowedSortColumns = {
      name: schema.restaurant.name,
      id: schema.restaurant.id,
    } as const;

    const sortColumn =
      query.sort_by && query.sort_by in allowedSortColumns
        ? allowedSortColumns[query.sort_by as keyof typeof allowedSortColumns]
        : schema.restaurant.createdAt;

    const sortOrder =
      query.sort_order === 'asc' ? asc(sortColumn) : desc(sortColumn);

    // 4. Query Total Count for Meta
    const [{ totalCount }] = await this.db
      .select({ totalCount: count() })
      .from(schema.restaurant)
      .where(whereClause);

    const total = Number(totalCount); //total count
    const lastPage = Math.ceil(total / per_page) || 1; //last page

    //5. Query Restaurants
    const restaurants = await this.db
      .select()
      .from(schema.restaurant)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(sortOrder);

    //from / to
    const from = total > 0 ? offset + 1 : null;
    const to = total > 0 ? Math.min(offset + restaurants.length, total) : null;
    const baseUrl = `${this.configService.get('DOMAIN_URL')}/api/restaurant`;
    return {
      data: restaurants,
      links: {
        first: `${baseUrl}?page=1`,
        last: `${baseUrl}?page=${lastPage}`,
        prev: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
        next: page < lastPage ? `${baseUrl}?page=${page + 1}` : null,
      },
      meta: {
        current_page: page,
        from,
        last_page: lastPage,
        path: baseUrl,
        per_page,
        to,
        total,
      },
    };
  }

  async findMine(ownerId: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurant)
      .where(eq(schema.restaurant.ownerId, ownerId));
    return restaurant ?? null;
  }

  async findById(id: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurant)
      .where(eq(schema.restaurant.id, id));

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async updateRestaurant(
    id: string,
    ownerId: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ) {
    const [existing] = await this.db
      .select()
      .from(schema.restaurant)
      .where(eq(schema.restaurant.id, id));

    if (!existing) {
      throw new NotFoundException('Restaurant not found');
    }
    if (existing.ownerId !== ownerId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    const [update] = await this.db
      .update(schema.restaurant)
      .set({ ...updateRestaurantDto, updatedAt: new Date() })
      .where(eq(schema.restaurant.id, id))
      .returning({
        id: schema.restaurant.id,
        ownerId: schema.restaurant.ownerId,
        name: schema.restaurant.name,
        description: schema.restaurant.description,
        address: schema.restaurant.address,
        imageUrl: schema.restaurant.imageUrl,
        rating: schema.restaurant.rating,
        cuisineType: schema.restaurant.cuisineType,
        isOpen: schema.restaurant.isOpen,
        createdAt: schema.restaurant.createdAt,
        updatedAt: schema.restaurant.updatedAt,
      });
    return update;
  }
}

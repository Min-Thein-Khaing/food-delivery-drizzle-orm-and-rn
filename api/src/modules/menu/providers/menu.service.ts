import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { CreateCategoryDto } from '../dto/create-category.dto.js';
import { schema } from '../../../db/index.js';
import { eq } from 'drizzle-orm';
import { UpdateCategoryDto } from '../dto/update-category.dto.js';

@Injectable()
export class MenuService {
    constructor(
        @Inject('DB')
        private readonly db: NeonHttpDatabase,
    ) { }

    //categories

    async createCategory(ownerId: string, createCategoryDto: CreateCategoryDto) {
        const [restaurant] = await this.db.select().from(schema.restaurant).where(eq(schema.restaurant.ownerId, ownerId))
        if (!restaurant) {
            throw new NotFoundException("Create Restaurant first")
        }

        const [category] = await this.db.insert(schema.menuCategory).values({ restaurantId: restaurant.id, ...createCategoryDto }).returning()

        return category
    }

    async getCategories(restaurantId: string) {
        return this.db.select().from(schema.menuCategory).where(eq(schema.menuCategory.restaurantId, restaurantId))
    }

    async update(id: string, restaurantId: string, updateCategoryDto: UpdateCategoryDto) {
        const [category] = await this.db.select().from(schema.menuCategory).where(eq(schema.menuCategory.id, id))

        if (!category) {
            throw new NotFoundException("category not found")
        }
        if (category.restaurantId !== restaurantId) {
            throw new ForbiddenException("the category do not belong to your restaurant")
        }

        const [updated] = await this.db.update(schema.menuCategory).set(updateCategoryDto).where(eq(schema.menuCategory.id, id)).returning()

        return updated
    }


    async delete(id: string, restaurantId: string) {
        const [category] = await this.db.select().from(schema.menuCategory).where(eq(schema.menuCategory.id, id))

        if (!category) {
            throw new NotFoundException("category not found")
        }
        if (category.restaurantId !== restaurantId) {
            throw new ForbiddenException("the category do not belong to your restaurant")
        }
        await this.db.delete(schema.menuCategory).where(eq(schema.menuCategory.id, id)).returning()
        return {
            message:"Category Successfully Delete"
        }
    }

}

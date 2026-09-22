import { pgTable,text,uuid,timestamp,numeric,boolean } from "drizzle-orm/pg-core";
import { restaurant } from "./restaurant.js";


export const menuCategory = pgTable('menu_category',{
    id: uuid('id').primaryKey().defaultRandom(),
    restaurantId: uuid('restaurant_id').notNull().references(()=>restaurant.id ,{onDelete: 'cascade'}),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
export const menuItems = pgTable('menu_items',{
    id: uuid('id').primaryKey().defaultRandom(),
    categoryId: uuid('category_id').notNull().references(()=>menuCategory.id ,{onDelete: 'cascade'}),
    restaurantId: uuid('restaurant_id').notNull().references(()=>restaurant.id ,{onDelete: 'cascade'}),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: numeric('price',{precision:10,scale:2}).notNull(),
    imageUrl: text('image_url'),
    isAvailable: boolean('is_available').default(false).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type MenuCategory = typeof menuCategory.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuCategory = typeof menuCategory.$inferInsert;
export type NewMenuItem = typeof menuItems.$inferInsert;
import {pgTable,boolean,uuid,timestamp,text} from "drizzle-orm/pg-core";
import { user } from "./user.js";



export const restaurant = pgTable('restaurant',{
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id').notNull().references(()=>user.id ,{onDelete: 'cascade'}),
    name: text('name').notNull(),
    description: text('description').notNull(),
    address: text('address').notNull(),
    imageUrl: text('image_url'),
    rating :text('rating').default('0'),
    cuisineType: text('cuisine_type').notNull(),
    isOpen: boolean('is_open').default(false).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Restaurant = typeof restaurant.$inferSelect;
export type NewRestaurant = typeof restaurant.$inferInsert;
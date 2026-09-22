import {pgTable,integer,text,uuid,timestamp} from "drizzle-orm/pg-core";
import { user } from "./user.js";
import { restaurant } from "./restaurant.js";
import { order } from "./order.js";


export const review = pgTable('review',{
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(()=>user.id),
    restaurantId: uuid('restaurant_id').notNull().references(()=>restaurant.id),
    orderId:uuid('order_id').notNull().references(()=>order.id),
    driverId:uuid('driver_id').references(()=>user.id),
    restaurantRating: integer('restaurant_rating'),
    driverRating: integer('driver_rating'),
    comment: text('comment'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Review = typeof review.$inferSelect;
export type NewReview = typeof review.$inferInsert;
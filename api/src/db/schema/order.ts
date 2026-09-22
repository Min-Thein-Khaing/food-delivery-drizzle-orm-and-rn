import { pgTable, uuid, timestamp, text, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './user.js';
import { restaurant } from './restaurant.js';
import { menuItems } from './menus.js';

export const orderStatusEnum = pgEnum('order_status', [
    'PENDING',//pending for stripe
    'CONFIRMED',//confirm for stripe
    'PREPARING',//preparing for user
    'READY',//ready for pickup for driver
    'PICKED_UP',//picked up for driver
    'DELIVERED',//delivered for user
    'CANCELLED']);//cancelled for user


export const order = pgTable('order', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => user.id),
    restaurantId: uuid('restaurant_id').notNull().references(() => restaurant.id),
    driverId: uuid('driver_id').references(() => user.id),
    status: orderStatusEnum('status').notNull().default('PENDING'),
    totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
    deliveryAddress:text('delivery_address').notNull(),
    stripePaymentIntentId:text('stripe_payment_intent_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const orderItems = pgTable('order_items',{
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').notNull().references(() => order.id, { onDelete: 'cascade' }),
    menuItemId: uuid('menu_item_id').notNull().references(() => menuItems.id),
    quantity: numeric('quantity').notNull(),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Order = typeof order.$inferSelect;
export type NewOrder = typeof order.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
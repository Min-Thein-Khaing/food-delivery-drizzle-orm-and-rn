import * as z from "zod";

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  imageUrl: string | null;
  rating: string;
  cuisineType: string;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createRestaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(255, "Description must be 255 characters or fewer"),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address must be 255 characters or fewer"),
  cuisineType: z
    .string()
    .trim()
    .min(2, "Cuisine type must be at least 2 characters")
    .max(100, "Cuisine type must be 100 characters or fewer"),
  imageUrl: z
    .union([z.string().url("Enter a valid image URL"), z.literal("")])
    .optional(),
});

export type CreateRestaurantFormValues = z.infer<
  typeof createRestaurantSchema
>;

export type CreateRestaurantPayload = Omit<
  CreateRestaurantFormValues,
  "imageUrl"
> & {
  imageUrl?: string;
};

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type UpdateRestaurantFormValues = z.infer<
  typeof updateRestaurantSchema
>;

export type UpdateRestaurantPayload = Partial<CreateRestaurantPayload> & {
  isOpen?: boolean;
};

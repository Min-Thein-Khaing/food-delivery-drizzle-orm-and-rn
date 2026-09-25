import * as z from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["CUSTOMER", "RESTAURANT_OWNER", "DRIVER"]),
});
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type Register = RegisterSchemaType;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export type LoginSchemaType=z.infer<typeof loginSchema>
import * as z from "zod";

export const register = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["CUSTOMER", "RESTAURANT_OWNER", "DRIVER"]),
});
export type Register = z.infer<typeof register>;
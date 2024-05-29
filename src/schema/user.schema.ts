import * as z from "zod";

export const userZodSchema = z.object({
  body: z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export type UserType = z.infer<typeof userZodSchema>;

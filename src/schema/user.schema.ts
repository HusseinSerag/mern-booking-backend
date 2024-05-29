import * as z from "zod";

export const userZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email"),
    password: z
      .string({ required_error: "A Password is required" })
      .min(6, "Password should be atleast 6 characters!"),
    firstName: z.string({ required_error: "First name is required" }),
    lastName: z.string({ required_error: "Last name is required" }),
  }),
});

export type UserType = z.infer<typeof userZodSchema>;

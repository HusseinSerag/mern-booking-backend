import * as z from "zod";
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "An email is required!",
      })
      .email("Please enter a valid email!"),
    password: z
      .string({
        required_error: "A password is required",
      })
      .min(6, "A password is minimum 6 characters"),
  }),
});

export type LoginType = z.infer<typeof loginSchema>;

export const confirmMailSchema = z.object({
  params: z.object({
    token: z.string({ required_error: "A token is required" }),
  }),
});

export type ConfirmMailType = z.infer<typeof confirmMailSchema>;

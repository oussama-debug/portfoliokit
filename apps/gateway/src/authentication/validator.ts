import { z } from "zod";

export const createSchema = z.object({
  username: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /(?=.*[a-zA-Z])(?=.*\d)/,
      "Password must contain at least one letter and one number"
    ),
});

export const loginSchema = z.object({
  username: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /(?=.*[a-zA-Z])(?=.*\d)/,
      "Password must contain at least one letter and one number"
    ),
});

export const refreshSchema = z.object({
  token: z.string().min(6),
});

export const logoutSchema = z.object({
  token: z.string().min(6),
});

export type CreateUserInput = z.infer<typeof createSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshSchema>;
export type LogoutTokenInput = z.infer<typeof logoutSchema>;

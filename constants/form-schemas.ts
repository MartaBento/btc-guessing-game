import { z } from "zod";

export const LOGIN_SCHEMA = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(20, { message: "Password must be at most 20 characters." }),
});

export const CREATE_USER_SCHEMA = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required." })
    .max(20, { message: "First name must be at most 20 characters." })
    .regex(/^[A-Za-z]+$/, { message: "First name must contain only letters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(20, { message: "Password must be at most 20 characters." }),
});

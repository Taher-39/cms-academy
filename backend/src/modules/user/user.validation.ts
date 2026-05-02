import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name too long"),
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    role: z
      .enum(["student", "teacher"])
      .optional()
      .default("student"),
      // admin/moderator শুধু admin panel থেকে assign হবে
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address"),
    password: z.string({ error: "Password is required" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
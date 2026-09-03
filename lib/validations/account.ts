import { z } from "zod";

export const updateEmailSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

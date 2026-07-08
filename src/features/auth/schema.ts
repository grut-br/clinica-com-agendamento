import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Insira um endereço de e-mail válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

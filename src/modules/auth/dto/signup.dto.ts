import { z } from "zod";
import {
  zodSafeEmail,
  zodSafeString,
} from "../../../shared/validators/generic.validator";
import { zodPassword } from "../../../shared/validators/comon.validator";

export const signupDto = z
  .strictObject({
    email: zodSafeEmail(),
    name: zodSafeString()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    password: zodPassword(),
    confirmPassword: zodPassword("Confirmação de senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignupDto = z.infer<typeof signupDto>;

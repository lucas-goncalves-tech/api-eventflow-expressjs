import z from "zod";

export const zodPassword = (typeMessage: string = "Senha") =>
  z
    .string()
    .min(8, `${typeMessage} deve ter pelo menos 8 caracteres`)
    .max(32, `${typeMessage} deve ter no máximo 32 caracteres`);

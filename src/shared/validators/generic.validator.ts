import z from "zod";

function refineStrig(value: string) {
  const invalidCharacters = [
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/,
    /[\u200B-\u200F\uFEFF\u202A-\u202E\u2066-\u2069]/,
    /<[^>]*>/,
  ];
  for (const invalidCharacter of invalidCharacters) {
    if (invalidCharacter.test(value)) {
      return false;
    }
  }
  return true;
}

export const zodSafeString = (
  typeMessage: string = "Campo deve ser uma string"
) =>
  z.string(typeMessage).trim().normalize("NFC").refine(refineStrig, {
    message: "Carácteres inválidos",
  });

export const zodSafeNumber = (typeMessage: string = "Campo") =>
  z.coerce
    .number(`${typeMessage} deve ser um número`)
    .int(`${typeMessage} deve ser um número inteiro`)
    .nonnegative(`${typeMessage} deve ser um número não negativo`);

export const zodSafeEmail = (typeMessage: string = "Campo") =>
  z
    .email(`${typeMessage} deve ser um email`)
    .trim()
    .toLowerCase()
    .normalize("NFC")
    .refine(refineStrig, {
      message: "Carácteres inválidos",
    });

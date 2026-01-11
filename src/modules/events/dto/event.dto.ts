import z from "zod";
import {
  zodSafeNumber,
  zodSafeString,
} from "../../../shared/validators/generic.validator";

export const createEventDto = z
  .strictObject({
    title: zodSafeString()
      .min(3, "Titulo deve ter pelo menos 3 caracteres")
      .max(100, "Titulo deve ter no maximo 100 caracteres"),
    description: zodSafeString().optional().default("null"),
    starts_at: z.coerce.date(),
    ends_at: z.coerce.date(),
    location: zodSafeString()
      .max(200, "Local deve ter no maximo 200 caracteres")
      .optional()
      .default("null"),
    capacity: zodSafeNumber().default(100),
  })
  .refine((data) => data.ends_at > data.starts_at, {
    message: "Data final deve ser maior que a data de inicio",
    path: ["ends_at"],
  });

export type CreateEventDTO = z.infer<typeof createEventDto>;
export type UpdateEventDTO = z.infer<ReturnType<typeof createEventDto.partial>>;

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
    description: zodSafeString().optional(),
    starts_at: z.coerce.date(),
    ends_at: z.coerce.date(),
    location: zodSafeString()
      .max(200, "Local deve ter no maximo 200 caracteres")
      .optional(),
    capacity: zodSafeNumber().optional(),
  })
  .refine((data) => data.ends_at > data.starts_at, {
    message: "Data final deve ser maior que a data de inicio",
    path: ["ends_at"],
  });

export const updateEventDto = createEventDto.partial();

export type CreateEventDTO = z.infer<typeof createEventDto>;
export type UpdateEventDTO = z.infer<typeof updateEventDto>;

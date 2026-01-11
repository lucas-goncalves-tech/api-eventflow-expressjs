import { z } from "zod";
import {
  zodSafeNumber,
  zodSafeString,
} from "../../../shared/validators/generic.validator";

export const eventsQuerySchema = z.strictObject({
  search: zodSafeString().optional(),
  page: zodSafeNumber().default(1),
  limit: zodSafeNumber().default(10),
});

export const eventsParamsSchema = z.strictObject({
  id: z.uuid(),
});

export type EventsQueryDTO = z.infer<typeof eventsQuerySchema>;
export type EventsParamsDTO = z.infer<typeof eventsParamsSchema>;

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

export type EventsQueryDTO = z.infer<typeof eventsQuerySchema>;

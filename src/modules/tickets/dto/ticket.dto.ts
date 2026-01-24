import { z } from "zod";

export const ticketParamsSchema = z.object({
  id: z.uuid("ID do evento deve ser um UUID válido"),
});

export type TicketParamsDTO = z.infer<typeof ticketParamsSchema>;

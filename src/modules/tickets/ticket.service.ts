import { inject, injectable } from "tsyringe";
import { TicketRepository } from "./ticket.repository";
import type { ITicket, ITicketRepository } from "./interfaces/ticket.interface";
import { ConflictError } from "../../shared/errors/conflict.error";
import { GoneError } from "../../shared/errors/gone.error";
import { DatabasePool } from "../../database/data-source";
import { NotFoundError } from "../../shared/errors/not-found.error";

@injectable()
export class TicketService {
  constructor(
    @inject(TicketRepository) private ticketRepository: ITicketRepository,
    @inject(DatabasePool) private db: DatabasePool,
  ) {}

  async purchase(eventId: string, userId: string) {
    // TODO: Implementar lógica de compra:
    // - Usa withTransaction
    // - SELECT event FOR UPDATE (trava linha)
    // - Verifica remaining > 0 → senão GoneError
    // - Verifica se já tem ingresso → senão ConflictError
    // - UPDATE remaining = remaining - 1
    // - INSERT ticket
    // - Retorna ticket criado
    try {
      return await this.db.transaction(async (client) => {
        const { rows } = await client.query(
          `
          SELECT * FROM events WHERE id = $1 FOR UPDATE
        `,
          [eventId],
        );

        const event = rows[0];

        if (!event) {
          throw new NotFoundError("Evento não encontrado");
        }

        if (event.remaning <= 0) {
          throw new GoneError("Evento esgotado");
        }

        const ticketExist = await this.ticketRepository.findByEventAndUser(
          eventId,
          userId,
        );

        if (ticketExist) {
          throw new ConflictError(
            "Você já comprou um ingresso para este evento",
          );
        }

        const ticket = await this.ticketRepository.create(
          {
            event_id: eventId,
            user_id: userId,
            price_paid: event.price,
          },
          client,
        );

        return {
          title: event.title as string,
          price_paid: ticket.price_paid,
          purchased_at: ticket.purchased_at,
        };
      });
    } catch (err) {
      console.error("Erro ao comprar ticket: ", err);
      throw err;
    }
  }

  async listByUser(userId: string): Promise<ITicket[]> {
    return await this.ticketRepository.findByUser(userId);
  }
}

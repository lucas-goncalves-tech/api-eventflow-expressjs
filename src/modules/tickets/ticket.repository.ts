import { inject, injectable } from "tsyringe";
import { DatabasePool } from "../../database/data-source";
import type {
  ITicket,
  ITicketAvailability,
  ITicketRepository,
} from "./interfaces/ticket.interface";

@injectable()
export class TicketRepository implements ITicketRepository {
  constructor(
    @inject(DatabasePool)
    private pool: DatabasePool,
  ) {}

  async getAvailability(eventId: string): Promise<ITicketAvailability> {
    // TODO: Implementar query para buscar disponibilidade
    throw new Error("Method not implemented.");
  }

  async findByEventAndUser(
    eventId: string,
    userId: string,
  ): Promise<ITicket | null> {
    // TODO: Implementar query para verificar se usuário já comprou
    throw new Error("Method not implemented.");
  }

  async create(eventId: string, userId: string): Promise<ITicket> {
    // TODO: Implementar insert com transaction para evitar oversell
    throw new Error("Method not implemented.");
  }

  async countSold(eventId: string): Promise<number> {
    // TODO: Implementar contagem de tickets vendidos
    throw new Error("Method not implemented.");
  }
}

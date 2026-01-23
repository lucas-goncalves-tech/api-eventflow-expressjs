import { inject, injectable } from "tsyringe";
import { TicketRepository } from "./ticket.repository";
import type {
  ITicket,
  ITicketAvailability,
  ITicketRepository,
} from "./interfaces/ticket.interface";
import { ConflictError } from "../../shared/errors/conflict.error";
import { GoneError } from "../../shared/errors/gone.error";

@injectable()
export class TicketService {
  constructor(
    @inject(TicketRepository) private ticketRepository: ITicketRepository,
  ) {}

  async getAvailability(eventId: string): Promise<ITicketAvailability> {
    // TODO: Implementar lógica de disponibilidade
    throw new Error("Method not implemented.");
  }

  async purchase(eventId: string, userId: string): Promise<ITicket> {
    // TODO: Implementar lógica de compra com validações:
    // - Verificar se já comprou → ConflictError
    // - Verificar se esgotado → GoneError
    // - Usar transaction para evitar oversell
    throw new Error("Method not implemented.");
  }
}

import { inject, injectable } from "tsyringe";
import { TicketService } from "./ticket.service";
import type { Request, Response } from "express";
import type { TicketParamsDTO } from "./dto/ticket.dto";

@injectable()
export class TicketController {
  constructor(@inject(TicketService) private ticketService: TicketService) {}

  getAvailability = async (req: Request, res: Response) => {
    const { id } = req.safeParams as TicketParamsDTO;
    const result = await this.ticketService.getAvailability(id);

    res.json(result);
  };

  purchase = async (req: Request, res: Response) => {
    const { id: eventId } = req.safeParams as TicketParamsDTO;
    const { sid: userId } = req.user!;

    const result = await this.ticketService.purchase(eventId, userId);

    res.status(201).json({
      message: "Ticket adquirido com sucesso",
      data: result,
    });
  };
}

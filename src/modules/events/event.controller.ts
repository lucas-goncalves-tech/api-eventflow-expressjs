import { inject, injectable } from "tsyringe";
import { EventService } from "./event.service";
import type { Request, Response } from "express";

@injectable()
export class EventController {
  constructor(@inject(EventService) private eventService: EventService) {}

  createEvent = async (req: Request, res: Response) => {
    const eventData = req.body;
    const result = await this.eventService.createEvent(eventData);
    res.status(201).json({
      message: `Evento ${result.title} criado com sucesso`,
    });
  };
}

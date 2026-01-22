import { inject, injectable } from "tsyringe";
import { EventService } from "./event.service";
import type { Request, Response } from "express";
import type { EventsQueryDTO } from "./dto/event-params.dto";
import type { CreateEventDTO } from "./dto/event.dto";

@injectable()
export class EventController {
  constructor(@inject(EventService) private eventService: EventService) {}

  findMany = async (req: Request, res: Response) => {
    const query = req.safeQuery as EventsQueryDTO;
    const result = await this.eventService.findMany(query);

    res.json(result);
  };

  findById = async (req: Request, res: Response) => {};

  create = async (req: Request, res: Response) => {
    const newEvent = req.safeBody as CreateEventDTO;
    const { sid } = req.user!;

    const result = await this.eventService.create(sid, newEvent);

    res.status(201).json({
      message: `Evento ${result.title} criado com sucesso`,
      data: result,
    });
  };

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};
}

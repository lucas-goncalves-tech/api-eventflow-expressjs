import { inject, injectable } from "tsyringe";
import { EventService } from "./event.service";
import type { Request, Response } from "express";
import type { EventsParamsDTO, EventsQueryDTO } from "./dto/event-params.dto";
import type { CreateEventDTO, UpdateEventDTO } from "./dto/event.dto";

@injectable()
export class EventController {
  constructor(@inject(EventService) private eventService: EventService) {}

  findMany = async (req: Request, res: Response) => {
    const query = req.safeQuery as EventsQueryDTO;
    const result = await this.eventService.findMany(query);

    res.json(result);
  };

  findById = async (req: Request, res: Response) => {
    const { id } = req.safeParams as EventsParamsDTO;
    const result = await this.eventService.findById(id);

    res.json(result);
  };

  create = async (req: Request, res: Response) => {
    const newEvent = req.safeBody as CreateEventDTO;
    const { sid } = req.user!;

    const result = await this.eventService.create(sid, newEvent);

    res.status(201).json({
      message: `Evento ${result.title} criado com sucesso`,
      data: result,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.safeParams as EventsParamsDTO;
    const userData = req.user!;
    const body = req.safeBody as UpdateEventDTO;

    const result = await this.eventService.update(id, userData, body);

    res.json({
      message: `Evento ${result.title} atualizado com sucesso`,
      data: result,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.safeParams as EventsParamsDTO;
    const userData = req.user!;
    await this.eventService.delete(id, userData);

    res.status(204).end();
  };
}

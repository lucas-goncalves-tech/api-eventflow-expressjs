import { inject, injectable } from "tsyringe";
import { EventService } from "./event.service";
import type { Request, Response } from "express";
import type { EventsParamsDTO, EventsQueryDTO } from "./dto/event-params.dto";
import type { CreateEventDTO, UpdateEventDTO } from "./dto/event.dto";

@injectable()
export class EventController {
  constructor(@inject(EventService) private eventService: EventService) {}

  findById = async (req: Request, res: Response) => {
    const { id } = req.safeParams as EventsParamsDTO;
    const result = await this.eventService.findById(id);
    res.json(result);
  };

  findMany = async (req: Request, res: Response) => {
    const { search, limit, page } = req.safeQuery as EventsQueryDTO;
    const result = await this.eventService.findMany({ search, limit, page });
    res.json(result);
  };

  create = async (req: Request, res: Response) => {
    const eventData = req.safeBody as CreateEventDTO;
    const result = await this.eventService.create(eventData);
    res.status(201).json({
      message: `Evento ${result.title} criado com sucesso`,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.safeParams as EventsParamsDTO;
    const eventData = req.safeBody as UpdateEventDTO;
    console.log("BODY", eventData);
    const result = await this.eventService.update(id, eventData);
    res.json({
      message: `Evento ${result.title} atualizado com sucesso`,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.safeParams as EventsParamsDTO;
    await this.eventService.delete(id);
    res.status(204).end();
  };
}

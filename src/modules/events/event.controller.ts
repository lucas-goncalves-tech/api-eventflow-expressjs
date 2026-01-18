import { inject, injectable } from "tsyringe";
import { EventService } from "./event.service";
import type { Request, Response } from "express";
import type { EventsParamsDTO, EventsQueryDTO } from "./dto/event-params.dto";
import type { CreateEventDTO, UpdateEventDTO } from "./dto/event.dto";

@injectable()
export class EventController {
  constructor(@inject(EventService) private eventService: EventService) {}

  findById = async (req: Request, res: Response) => {};

  findMany = async (req: Request, res: Response) => {};

  create = async (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {};

  delete = async (req: Request, res: Response) => {};
}

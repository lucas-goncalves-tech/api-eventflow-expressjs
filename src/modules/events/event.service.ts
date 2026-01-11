import { inject, injectable } from "tsyringe";
import { EventRepository } from "./event.repository";
import type { CreateEventDTO } from "./dto/event.dto";
import { BadRequestError } from "../../shared/errors/bad-request.error";
import type { IEvent } from "./interfaces/event.interface";
import type { EventsQueryDTO } from "./dto/event-params.dto";
import { NotFoundError } from "../../shared/errors/not-found.error";

@injectable()
export class EventService {
  constructor(
    @inject(EventRepository) private eventRepository: EventRepository
  ) {}

  async findById(id: string) {
    const result = await this.eventRepository.findById(id);
    if (!result) throw new NotFoundError("Evento não encontrado");
    return result;
  }

  async findMany({ search, limit, page }: EventsQueryDTO) {
    return this.eventRepository.findMany({ search, limit, page });
  }

  async createEvent(eventData: CreateEventDTO): Promise<IEvent> {
    const result = await this.eventRepository.create(eventData);
    if (!result) throw new BadRequestError("Erro ao criar evento");
    return result;
  }
}

import { inject, injectable } from "tsyringe";
import { EventRepository } from "./event.repository";
import type { CreateEventDTO, UpdateEventDTO } from "./dto/event.dto";
import { BadRequestError } from "../../shared/errors/bad-request.error";
import type { IEvent, IEventRepository } from "./interfaces/event.interface";
import type { EventsQueryDTO } from "./dto/event-params.dto";
import { NotFoundError } from "../../shared/errors/not-found.error";
import { UserRepository } from "../user/user.repository";
import type { IUserRepository } from "../user/interface/user.interface";
import type { UserPayload } from "../../shared/security/token.security";
import { ForbiddenError } from "../../shared/errors/forbidden.error";

@injectable()
export class EventService {
  constructor(
    @inject(EventRepository) private eventRepository: IEventRepository,
  ) {}

  private removeOwnerId(event: IEvent) {
    const { owner_id, ...safe } = event;
    return safe;
  }

  private verifyOwnership(userData: UserPayload, ownerId: string) {
    if (userData.sid !== ownerId && userData.role !== "ADMIN") {
      throw new ForbiddenError();
    }
  }

  async findMany(findQuery: EventsQueryDTO) {
    const result = await this.eventRepository.findMany(findQuery);
    const safeEventList = result.data.map(({ owner_id, ...safe }) => safe);

    return {
      data: safeEventList,
      meta: result.meta,
    };
  }

  async findById(id: string) {
    const eventExist = await this.eventRepository.findById(id);
    if (!eventExist) {
      throw new NotFoundError("Evento não encontrado");
    }
    return this.removeOwnerId(eventExist);
  }

  async create(userId: string, eventData: CreateEventDTO) {
    const result = await this.eventRepository.create(userId, eventData);
    return this.removeOwnerId(result);
  }

  async update(id: string, userData: UserPayload, eventData: UpdateEventDTO) {
    const eventExist = await this.eventRepository.findById(id);
    if (!eventExist) {
      throw new NotFoundError("Evento não encontrado");
    }

    this.verifyOwnership(userData, eventExist.owner_id);

    const result = await this.eventRepository.update(id, eventData);

    return this.removeOwnerId(result);
  }

  async delete(id: string, userData: UserPayload) {
    const eventExist = await this.eventRepository.findById(id);
    if (!eventExist) {
      throw new NotFoundError("Evento não encontrado");
    }

    if (userData.sid !== eventExist.owner_id && userData.role !== "ADMIN") {
      throw new ForbiddenError();
    }

    await this.eventRepository.delete(id);
  }
}

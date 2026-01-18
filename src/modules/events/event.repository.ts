import { inject, injectable } from "tsyringe";
import { DatabasePool } from "../../database/data-source";
import type {
  ICreateEvent,
  IEvent,
  IEventRepository,
  IEventsQuery,
  IFindManyEvents,
} from "./interfaces/event.interface";

@injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @inject(DatabasePool)
    private pool: DatabasePool,
  ) {}

  async findMany({ search, limit = 10, page = 1 }: IEventsQuery) {}

  async findById(id: string) {}

  async create(userId: string, data: ICreateEvent) {}

  async update(id: string, eventData: Partial<IEvent>) {}

  async delete(id: string) {}
}

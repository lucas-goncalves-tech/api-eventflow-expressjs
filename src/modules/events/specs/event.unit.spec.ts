import { describe, expect, it, vi, type Mocked } from "vitest";
import type {
  IEvent,
  IEventRepository,
  IFindManyEvents,
} from "../interfaces/event.interface";
import type { IUserRepository } from "../../user/interface/user.interface";
import { EventService } from "../event.service";
import { beforeEach } from "node:test";
import { NotFoundError } from "../../../shared/errors/not-found.error";
import type { EventsParamsDTO, EventsQueryDTO } from "../dto/event-params.dto";
import type { CreateEventDTO } from "../dto/event.dto";
import { generateNewEvent } from "../../../shared/helpers/event-spec.helper";

function generateFakeEvent(override?: Record<string, unknown>): IEvent {
  const now = new Date();
  return {
    id: "UUID",
    title: "test event",
    description: "test description",
    starts_at: now,
    ends_at: now,
    location: "test location",
    capacity: 100,
    created_at: now,
    ...override,
  };
}

describe("EventService unit", () => {
  const mockUserRepository: Mocked<IUserRepository> = {
    findById: vi.fn(),
    create: vi.fn(),
    findByEmail: vi.fn(),
  };
  const mockEventRepository: Mocked<IEventRepository> = {
    create: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  };

  const service = new EventService(mockEventRepository, mockUserRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return list of events with page and limit params", async () => {
    const params: EventsQueryDTO = {
      page: 1,
      limit: 10,
    };
    const fakeEvent = generateFakeEvent();
    const fakeListEvent: IFindManyEvents = {
      data: [fakeEvent],
      meta: {
        total: 10,
        page: 1,
        limit: 10,
        totalPages: 2,
      },
    };

    mockEventRepository.findMany.mockResolvedValue(fakeListEvent);
    const result = await service.findMany(params);

    expect(mockEventRepository.findMany).toHaveBeenCalledWith(params);
    expect(result).toEqual(fakeListEvent);
  });

  it("should return event when id exist", async () => {
    const id = "UUID";
    const fakeEvent = generateFakeEvent({ id });

    mockEventRepository.findById.mockResolvedValue(fakeEvent);
    const result = await service.findById(id);

    expect(mockEventRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(fakeEvent);
  });

  it("should throw NotFoundError when id not exist", async () => {
    mockEventRepository.findById.mockResolvedValue(null);

    await expect(service.findById("12345")).rejects.toThrow(NotFoundError);
  });

  it("should create event and return event data when role is ORGANIZER or ADMIN", async () => {
    const newEvent = generateNewEvent();
    const fakeEvent = generateFakeEvent(newEvent);

    mockEventRepository;
  });
});

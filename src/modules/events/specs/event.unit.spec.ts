import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import type {
  IEvent,
  IEventRepository,
  IFindManyEvents,
} from "../interfaces/event.interface";
import { EventService } from "../event.service";

import { NotFoundError } from "../../../shared/errors/not-found.error";
import type { EventsQueryDTO } from "../dto/event-params.dto";
import {
  expectedEventShape,
  generateNewEvent,
} from "../../../shared/helpers/event-spec.helper";
import type { UserPayload } from "../../../shared/security/token.security";
import { ForbiddenError } from "../../../shared/errors/forbidden.error";

function generateFakeEvent(override?: Partial<IEvent>): IEvent {
  const now = new Date();
  return {
    id: "UUID",
    owner_id: "UUID",
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
  const mockEventRepository: Mocked<IEventRepository> = {
    create: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  };

  const service = new EventService(mockEventRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findMany", () => {
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
      expect(result).toMatchObject({
        data: [expectedEventShape()],
        meta: fakeListEvent.meta,
      });
      expect(result.data[0]).not.toHaveProperty("owner_id");
    });
  });

  describe("findById", () => {
    it("should return event when id exists", async () => {
      const id = "UUID";
      const fakeEvent = generateFakeEvent({ id });

      mockEventRepository.findById.mockResolvedValue(fakeEvent);
      const result = await service.findById(id);

      expect(mockEventRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toMatchObject(expectedEventShape());
      expect(result).not.toHaveProperty("owner_id");
    });

    it("should throw NotFoundError when id does not exist", async () => {
      const eventId = "nonexist";
      mockEventRepository.findById.mockResolvedValue(null);

      await expect(service.findById(eventId)).rejects.toThrow(NotFoundError);
    });
  });

  describe("create", () => {
    it("should create event and return event data", async () => {
      const userId = "UUID";
      const newEvent = generateNewEvent();
      const fakeEvent = generateFakeEvent({ ...newEvent, owner_id: userId });

      mockEventRepository.create.mockResolvedValue(fakeEvent);
      const result = await service.create(userId, newEvent);

      expect(mockEventRepository.create).toHaveBeenCalledWith(userId, newEvent);
      expect(result).toMatchObject(expectedEventShape());
      expect(result).not.toHaveProperty("owner_id");
    });
  });

  describe("update", () => {
    it("should return updated event when user is owner", async () => {
      const userPayload: UserPayload = {
        sid: "owner",
        role: "USER",
      };
      const eventId = "UUID";
      const updateEvent = generateNewEvent({
        title: "new event updated",
        description: "new description",
      });
      const fakeEvent = generateFakeEvent({
        id: eventId,
        owner_id: userPayload.sid,
      });

      mockEventRepository.findById.mockResolvedValue(fakeEvent);
      mockEventRepository.update.mockResolvedValue({
        ...fakeEvent,
        ...updateEvent,
      });
      const result = await service.update(eventId, userPayload, updateEvent);

      expect(mockEventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(mockEventRepository.update).toHaveBeenCalledWith(
        eventId,
        updateEvent,
      );
      expect(result).toMatchObject(expectedEventShape());
      expect(result.title).toBe(updateEvent.title);
      expect(result.description).toBe(updateEvent.description);
      expect(result).not.toHaveProperty("owner_id");
    });

    it("should allow ADMIN to update any event and return event data", async () => {
      const userPayload: UserPayload = {
        sid: "nonOwner",
        role: "ADMIN",
      };
      const eventId = "UUID";
      const updateEvent = generateNewEvent({
        title: "new event updated",
        description: "new description",
      });
      const fakeEvent = generateFakeEvent({
        id: eventId,
        owner_id: "UUID",
      });

      mockEventRepository.findById.mockResolvedValue(fakeEvent);
      mockEventRepository.update.mockResolvedValue({
        ...fakeEvent,
        ...updateEvent,
      });
      const result = await service.update(eventId, userPayload, updateEvent);

      expect(mockEventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(mockEventRepository.update).toHaveBeenCalledWith(
        eventId,
        updateEvent,
      );
      expect(result).toMatchObject(expectedEventShape());
      expect(result.title).toBe(updateEvent.title);
      expect(result.description).toBe(updateEvent.description);
      expect(result).not.toHaveProperty("owner_id");
    });

    it("should throw NotFoundError when event does not exist", async () => {
      const userPayload: UserPayload = {
        sid: "UUID",
        role: "USER",
      };
      const updateEvent = generateNewEvent();

      mockEventRepository.findById.mockResolvedValue(null);

      await expect(
        service.update("nonexist", userPayload, updateEvent),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ForbiddenError when not owner and not ADMIN", async () => {
      const eventId = "UUID";
      const userPayload: UserPayload = {
        sid: "nonowner",
        role: "USER",
      };
      const fakeEvent = generateFakeEvent({
        id: eventId,
        owner_id: "UUID",
      });
      const updateEvent = generateNewEvent();

      mockEventRepository.findById.mockResolvedValue(fakeEvent);

      await expect(
        service.update(eventId, userPayload, updateEvent),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe("delete", () => {
    it("should delete event and return void when is owner", async () => {
      const eventId = "UUID";
      const userPayload: UserPayload = {
        sid: "UUID",
        role: "USER",
      };
      const fakeEvent = generateFakeEvent({
        id: eventId,
        owner_id: userPayload.sid,
      });

      mockEventRepository.findById.mockResolvedValue(fakeEvent);
      const result = await service.delete(eventId, userPayload);

      expect(mockEventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(mockEventRepository.delete).toHaveBeenCalledWith(eventId);
      expect(result).not.toBeDefined();
    });
    it("should allow ADMIN to delete any event and return void", async () => {
      const eventId = "UUID";
      const userPayload: UserPayload = {
        sid: "nonowner",
        role: "ADMIN",
      };
      const fakeEvent = generateFakeEvent({
        id: eventId,
        owner_id: "UUID",
      });

      mockEventRepository.findById.mockResolvedValue(fakeEvent);
      const result = await service.delete(eventId, userPayload);

      expect(mockEventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(mockEventRepository.delete).toHaveBeenCalledWith(eventId);
      expect(result).not.toBeDefined();
    });

    it("should throw NotFoundError when event does not exist", async () => {
      const userPayload: UserPayload = {
        sid: "UUID",
        role: "USER",
      };

      mockEventRepository.findById.mockResolvedValue(null);

      await expect(service.delete("nonexist", userPayload)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should throw ForbiddenError when not owner and not ADMIN", async () => {
      const eventId = "UUID";
      const userPayload: UserPayload = {
        sid: "nonowner",
        role: "USER",
      };
      const fakeEvent = generateFakeEvent({
        id: eventId,
        owner_id: "UUID",
      });

      mockEventRepository.findById.mockResolvedValue(fakeEvent);

      await expect(service.delete(eventId, userPayload)).rejects.toThrow(
        ForbiddenError,
      );
    });
  });
});

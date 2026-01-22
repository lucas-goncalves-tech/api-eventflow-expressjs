import { container } from "tsyringe";
import { App } from "../../../app";
import request from "supertest";
import { describe, expect, it } from "vitest";
import type { CreateEventDTO } from "../dto/event.dto";
import {
  expectedEventShape,
  generateNewEvent,
} from "../../../shared/helpers/event-spec.helper";
import type {
  ICreateEventResponse,
  IEvent,
  IFindManyEvents,
  IUpdateEventResponse,
} from "../interfaces/event.interface";
import type TestAgent from "supertest/lib/agent";
import { authUser } from "../../../shared/helpers/auth-spec.helper";

const BASE_URL = "/api/v1/events";
const req = request(container.resolve(App).express);

async function postEvent(
  agent: TestAgent,
  override?: CreateEventDTO | Record<string, unknown>,
) {
  const payload = generateNewEvent(override);
  const result = await agent.post(BASE_URL).send(payload);
  const body = result.body as ICreateEventResponse;
  return { payload, result, body };
}

describe("Event integration spec", () => {
  describe(`GET ${BASE_URL}`, () => {
    it("should return status 200 with pagination structure", async () => {
      const { reqAgent } = await authUser("organizer");
      for (let i = 1; i <= 3; i++) {
        await postEvent(reqAgent);
      }
      const shape = expectedEventShape();

      const result = await req.get(BASE_URL);
      const body = result.body as IFindManyEvents;

      expect(result.status).toBe(200);
      expect(body.data).toHaveLength(3);
      expect(body.data[0]).toMatchObject(shape);
      expect(body.meta).toEqual({
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it("should return status 200 with pagination structure when ?page=2&limit=3", async () => {
      const { reqAgent } = await authUser("organizer");
      for (let i = 1; i <= 5; i++) {
        await postEvent(reqAgent);
      }

      const result = await req.get(`${BASE_URL}?page=2&limit=3`);
      const body = result.body as IFindManyEvents;
      const shape = expectedEventShape();

      expect(result.status).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.data[0]).toMatchObject(shape);
      expect(body.meta).toEqual({
        total: 5,
        page: 2,
        limit: 3,
        totalPages: 2,
      });
    });
  });

  describe(`GET ${BASE_URL}/:id`, () => {
    it("should return status 200 when event exist", async () => {
      const { reqAgent } = await authUser("organizer");
      const { body: postBody } = await postEvent(reqAgent);

      const result = await req.get(`${BASE_URL}/${postBody.data.id}`);
      const shape = expectedEventShape();

      expect(result.status).toBe(200);
      expect(result.body).toMatchObject(shape);
    });

    it("should return status 400 when ID is not valid", async () => {
      const result = await req.get(`${BASE_URL}/1234`);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message");
      expect(result.body).toHaveProperty("details");
    });

    it("should return status 404 when event nonexist", async () => {
      const UUID = crypto.randomUUID();

      const result = await req.get(`${BASE_URL}/${UUID}`);

      expect(result.status).toBe(404);
      expect(result.body).toHaveProperty("message");
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it("should return status 201 and create event when role is ORGANIZER", async () => {
      const { reqAgent } = await authUser("organizer");
      const { result } = await postEvent(reqAgent);
      const body = result.body as ICreateEventResponse;
      const shape = expectedEventShape();

      expect(result.status).toBe(201);
      expect(body).toHaveProperty("message");
      expect(body.data).toMatchObject(shape);
      expect(body.data).not.toHaveProperty("owner_id");
    });
    it("should create event when role is ADMIN", async () => {
      const { reqAgent } = await authUser("admin");
      const { result } = await postEvent(reqAgent);

      expect(result.status).toBe(201);
    });

    it("should return status 403 when role is USER", async () => {
      const { reqAgent } = await authUser("user");
      const { result } = await postEvent(reqAgent);

      expect(result.status).toBe(403);
      expect(result.body).toHaveProperty("message");
    });

    it("should return status 400 when body is invalid", async () => {
      const { reqAgent } = await authUser("organizer");
      const { result } = await postEvent(reqAgent, {
        banana: "wrog value",
      });

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message");
    });

    it("should return status 400 when ends_at less than starts_at", async () => {
      const now = new Date();
      let ends_at = now;
      ends_at.setDate(now.getDate() - 1);

      const { reqAgent } = await authUser("organizer");
      const { result } = await postEvent(reqAgent, {
        starts_at: now,
        ends_at,
      });

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message");
    });

    it("should return status 401 when not logged", async () => {
      const { result } = await postEvent(req);

      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty("message");
    });
  });

  describe(`PUT ${BASE_URL}`, () => {
    it("should allow ORGANIZER update event when is owner", async () => {
      const updateEvent = generateNewEvent({
        title: "new event title",
        description: "new event description",
      });
      const { reqAgent } = await authUser("organizer");
      const { body: postBody } = await postEvent(reqAgent);

      const updatedEvent = await reqAgent
        .put(`${BASE_URL}/${postBody.data.id}`)
        .send(updateEvent);
      const body = updatedEvent.body as IUpdateEventResponse;

      expect(updatedEvent.status).toBe(200);
      expect(body).toHaveProperty("message");
      expect(body.data.title).toBe(updateEvent.title);
      expect(body.data.description).toBe(updateEvent.description);
    });

    it("should return status 200 and allow ADMIN update any event", async () => {
      const updateEvent = generateNewEvent({
        title: "new event title",
        description: "new event description",
      });

      const { reqAgent } = await authUser("organizer");
      const { body: postBody } = await postEvent(reqAgent);

      const { reqAgent: reqAdminAgent } = await authUser("admin");

      const updatedEvent = await reqAdminAgent
        .put(`${BASE_URL}/${postBody.data.id}`)
        .send(updateEvent);
      const body = updatedEvent.body as IUpdateEventResponse;

      expect(updatedEvent.status).toBe(200);
      expect(body).toHaveProperty("message");
      expect(body.data.title).toBe(updateEvent.title);
      expect(body.data.description).toBe(updateEvent.description);
    });

    it("should return status 404 when event not exist", async () => {
      const UUID = crypto.randomUUID();
      const updateEvent = generateNewEvent({
        title: "new event title",
        description: "new event description",
      });

      const { reqAgent } = await authUser("organizer");

      const updatedEvent = await reqAgent
        .put(`${BASE_URL}/${UUID}`)
        .send(updateEvent);

      expect(updatedEvent.status).toBe(404);
      expect(updatedEvent.body).toHaveProperty("message");
    });

    it("should return status 403 when not owner and not ADMIN", async () => {
      const updateEvent = generateNewEvent({
        title: "new event title",
        description: "new event description",
      });
      const { reqAgent } = await authUser("organizer");
      const { body } = await postEvent(reqAgent);

      const { reqAgent: reqSecondAgent } = await authUser("organizer-second");

      const updatedEvent = await reqSecondAgent
        .put(`${BASE_URL}/${body.data.id}`)
        .send(updateEvent);

      expect(updatedEvent.status).toBe(403);
      expect(updatedEvent.body).toHaveProperty("message");
    });

    it("should return status 403 when is USER", async () => {
      const updateEvent = generateNewEvent({
        title: "new event title",
        description: "new event description",
      });
      const { reqAgent } = await authUser("organizer");
      const { body } = await postEvent(reqAgent);

      const { reqAgent: reqUserAgent } = await authUser("user");

      const updatedEvent = await reqUserAgent
        .put(`${BASE_URL}/${body.data.id}`)
        .send(updateEvent);

      expect(updatedEvent.status).toBe(403);
      expect(updatedEvent.body).toHaveProperty("message");
    });

    it("should return status 401 when not logged", async () => {
      const updatedEvent = await req.put(`${BASE_URL}/1234`);

      expect(updatedEvent.status).toBe(401);
      expect(updatedEvent.body).toHaveProperty("message");
    });

    it("should return status 400 when ID is not valid", async () => {
      const { reqAgent } = await authUser("organizer");
      const result = await reqAgent.put(`${BASE_URL}/1234`);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message");
      expect(result.body).toHaveProperty("details");
    });
  });

  describe(`DELETE ${BASE_URL}`, () => {
    it("should return status 204 when owner delete event", async () => {
      const { reqAgent } = await authUser("organizer");
      const { body } = await postEvent(reqAgent);

      const result = await reqAgent.delete(`${BASE_URL}/${body.data.id}`);

      expect(result.status).toBe(204);
      expect(result.body).toEqual({});
    });

    it("should return status 204 and allow ADMIN delete any event", async () => {
      const { reqAgent } = await authUser("organizer");
      const { body: postBody } = await postEvent(reqAgent);

      const { reqAgent: reqAdminAgent } = await authUser("admin");

      const result = await reqAdminAgent.delete(
        `${BASE_URL}/${postBody.data.id}`,
      );

      expect(result.status).toBe(204);
      expect(result.body).toEqual({});
    });

    it("should return status 404 when event not exist", async () => {
      const { reqAgent } = await authUser("organizer");
      const UUID = crypto.randomUUID();

      const result = await reqAgent.delete(`${BASE_URL}/${UUID}`);

      expect(result.status).toBe(404);
      expect(result.body).toHaveProperty("message");
    });

    it("should return status 400 when ID is not valid", async () => {
      const { reqAgent } = await authUser("organizer");

      const result = await reqAgent.delete(`${BASE_URL}/1234`);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message");
      expect(result.body).toHaveProperty("details");
    });

    it("should return status 403 when not owner and not ADMIN", async () => {
      const { reqAgent } = await authUser("organizer");
      const { body } = await postEvent(reqAgent);

      const { reqAgent: reqSecondAgent } = await authUser("organizer-second");

      const result = await reqSecondAgent.delete(`${BASE_URL}/${body.data.id}`);

      expect(result.status).toBe(403);
      expect(result.body).toHaveProperty("message");
    });

    it("should return status 403 when is USER", async () => {
      const { reqAgent } = await authUser("organizer");
      const { body } = await postEvent(reqAgent);

      const { reqAgent: reqUserAgent } = await authUser("user");

      const updatedEvent = await reqUserAgent.delete(
        `${BASE_URL}/${body.data.id}`,
      );

      expect(updatedEvent.status).toBe(403);
      expect(updatedEvent.body).toHaveProperty("message");
    });

    it("should return status 401 when not logged", async () => {
      const updatedEvent = await req.delete(`${BASE_URL}/1234`);

      expect(updatedEvent.status).toBe(401);
      expect(updatedEvent.body).toHaveProperty("message");
    });
  });
});

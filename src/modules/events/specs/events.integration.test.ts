import { App } from "../../../app";
import { describe, expect, it } from "vitest";
import request from "supertest";
import type { CreateEventDTO, UpdateEventDTO } from "../dto/event.dto";
import { container } from "tsyringe";
import type {
  ICreateEventResponse,
  IFindManyEvents,
  IUpdateEventResponse,
} from "../interfaces/event.interface";

const BASE_URL = "/api/v1/events";
const endpoints = {
  findMany: BASE_URL,
  withId: (id: string) => `${BASE_URL}/${id}`,
};

const generatePayload = (overrides?: Record<string, unknown>) => {
  const now = new Date();
  let starts_at = new Date(now);
  starts_at.setDate(now.getDate() + 7);
  let ends_at = new Date(now);
  ends_at.setDate(now.getDate() + 14);

  return {
    title: "Rock in Rio",
    description: "Insane show",
    starts_at,
    ends_at,
    ...overrides,
  };
};

const createEvent = async (
  override?: Partial<CreateEventDTO> | Record<string, unknown>
) => {
  const payload = generatePayload(override);
  const response = await req.post(BASE_URL).send(payload);

  return {
    payload,
    response,
  };
};

const app = container.resolve(App).express;
const req = request(app);

describe("GET /api/v1/events", () => {
  it(`should return status 200 with pagination`, async () => {
    const { payload } = await createEvent();
    const res = await req.get(endpoints.findMany);
    const body: IFindManyEvents = res.body;

    expect(res.status).toBe(200);
    expect(body).toMatchObject({
      data: expect.any(Array),
      meta: expect.any(Object),
    });
    expect(body.data[0].title).toBe(payload.title);
    expect(body.meta.total).toBeGreaterThanOrEqual(1);
  });

  it(`should return status 200 with ?page=2`, async () => {
    for (let i = 1; i <= 3; i++) {
      await createEvent();
    }
    const res = await req.get(`${endpoints.findMany}?page=2&limit=2`);
    const body: IFindManyEvents = res.body;

    expect(res.status).toBe(200);
    expect(body.data).toBeInstanceOf(Array);
    expect(body.meta.page).toBe(2);
  });
});

describe("GET /api/v1/events/:id", () => {
  it("should return status 200 with exist event", async () => {
    const { response: createRes } = await createEvent();
    const createdEvent: ICreateEventResponse = createRes.body;

    const res = await req.get(`${endpoints.withId(createdEvent.data.id)}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(createdEvent.data.id);
    expect(res.body.title).toBe(createdEvent.data.title);
  });

  it("should return status 400 with invalid UUID", async () => {
    const res = await req.get(`${endpoints.withId("1234")}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("details");
  });

  it("should return status 404 when event not found", async () => {
    const UUID = crypto.randomUUID();
    const res = await req.get(`${endpoints.withId(UUID)}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });
});

describe("POST /api/v1/events", () => {
  it("should return status 201 with message and event data", async () => {
    const { payload, response } = await createEvent();
    const body: ICreateEventResponse = response.body;

    expect(response.status).toBe(201);
    expect(body).toMatchObject({
      message: expect.any(String),
      data: expect.any(Object),
    });
    expect(body.data.title).toBe(payload.title);
    expect(body.data.description).toBe(payload.description);
  });

  it("should return status 400 with invalid body", async () => {
    const { response } = await createEvent({
      banana: "arroz",
    });
    console.log(response);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("details");
  });

  it("should return 400 if ends_at is lower than starts_at", async () => {
    const { response } = await createEvent({
      starts_at: new Date("2010-10-05"),
      ends_at: new Date("2010-10-01"),
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("details");
  });
});

describe("PUT /api/v1/events/:id", () => {
  it("should return 200 with updated event", async () => {
    const { payload, response: createRes } = await createEvent();
    const createdEvent: ICreateEventResponse = createRes.body;
    const updatePayload: UpdateEventDTO = {
      title: "banana show",
      description: "Awesome show of bananas",
    };

    const updateRes = await req
      .put(endpoints.withId(createdEvent.data.id))
      .send(updatePayload);
    const updatedEvent: IUpdateEventResponse = updateRes.body;

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toMatchObject({
      message: expect.any(String),
      data: expect.any(Object),
    });
    expect(updatedEvent.data.title).not.toBe(payload.title);
    expect(updatedEvent.data.description).not.toBe(payload.description);
    expect(updatedEvent.data.title).toBe(updatePayload.title);
    expect(updatedEvent.data.description).toBe(updatePayload.description);
    expect(createdEvent.data.id).toBe(updatedEvent.data.id);
  });

  it("should return 404 when event not found", async () => {
    const UUID = crypto.randomUUID();
    const response = await req
      .put(endpoints.withId(UUID))
      .send(generatePayload());

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});

describe("DELETE /api/v1/events/:id", () => {
  it("should return 204 with deleted event", async () => {
    const { response: createRes } = await createEvent();
    const createdEvent: ICreateEventResponse = createRes.body;

    const response = await req.delete(endpoints.withId(createdEvent.data.id));

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should return 404 when event not found", async () => {
    const UUID = crypto.randomUUID();
    const response = await req.delete(endpoints.withId(UUID));

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});

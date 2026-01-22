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
  IFindManyEvents,
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

  return { payload, result };
}

describe(`POST ${BASE_URL}`, () => {
  it("should create event when role is ORGANIZER", async () => {
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

  it("should return status 401 when access_token not exist", async () => {
    const { result } = await postEvent(req);

    expect(result.status).toBe(401);
    expect(result.body).toHaveProperty("message");
  });
});

describe(`GET ${BASE_URL}`, () => {});

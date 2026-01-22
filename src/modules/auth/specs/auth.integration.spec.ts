import { describe, expect, it } from "vitest";
import { registerNewUser } from "../../../shared/helpers/auth-spec.helper";
import request from "supertest";
import { container } from "tsyringe";
import { App } from "../../../app";

const BASE_URL = "/api/v1/auth";
const req = request(container.resolve(App).express);

describe("POST /api/v1/auth/register", () => {
  it("should return status 201 and new user with valid body", async () => {
    const result = await registerNewUser();

    expect(result.status).toBe(201);
    expect(result.body).toMatchObject({
      email: expect.any(String),
      name: expect.any(String),
      role: "USER",
      created_at: expect.any(String),
    });
  });

  it("should return status 409 when send duplicated email", async () => {
    await registerNewUser();
    const result = await registerNewUser();

    expect(result.status).toBe(409);
    expect(result.body).toHaveProperty("message");
  });

  it("should return status 400 when send extra fields", async () => {
    const result = await registerNewUser({
      role: "ADMIN",
    });

    expect(result.status).toBe(400);
    expect(result.body).toHaveProperty("message");
    expect(result.body).toHaveProperty("details");
  });
});

describe("POST /api/v1/auth/login", () => {
  it("should return status 204 with cookie http only when credentials are valid", async () => {
    const credentials = {
      email: "test@valid.com",
      password: "12345678",
    };
    await registerNewUser(credentials);

    const result = await req.post(`${BASE_URL}/login`).send(credentials);
    const cookie = result.headers["set-cookie"]?.[0].toLowerCase() ?? "";

    expect(result.status).toBe(204);
    expect(result.body).toEqual({});
    expect(cookie).toContain("sid");
    expect(cookie).toContain("httponly");
    expect(cookie).toContain("samesite=lax");
  });

  it("should return status 401  when credentials are invalid", async () => {
    const credentials = {
      email: "test@invalid.com",
      password: "12345678",
    };
    await registerNewUser();

    const result = await req.post(`${BASE_URL}/login`).send(credentials);

    expect(result.status).toBe(401);
    expect(result.body).toHaveProperty("message");
  });
});

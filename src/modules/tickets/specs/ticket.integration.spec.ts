import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { App } from "../../../app";

describe("Tickets API Integration", () => {
  describe("GET /events/:id/tickets", () => {
    it.todo("should return 200 with availability");
  });

  describe("POST /events/:id/tickets", () => {
    it.todo("should return 201 with ticket when authenticated");
    it.todo("should return 409 when user already purchased");
    it.todo("should return 410 when sold out");
    it.todo("should return 401 without token");
  });
});

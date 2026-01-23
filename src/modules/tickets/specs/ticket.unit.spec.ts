import { describe, it, expect, beforeEach, vi, type Mocked } from "vitest";
import { TicketService } from "../ticket.service";
import type { ITicketRepository } from "../interfaces/ticket.interface";

describe("TicketService", () => {
  const mockTicketRepository: Mocked<ITicketRepository> = {
    getAvailability: vi.fn(),
    findByEventAndUser: vi.fn(),
    create: vi.fn(),
    countSold: vi.fn(),
  };

  const service = new TicketService(mockTicketRepository);
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAvailability", () => {
    it.todo("should return { total, sold, available }");
  });

  describe("purchase", () => {
    it.todo("should return ticket when available");
    it.todo("should throw ConflictError when user already purchased");
    it.todo("should throw GoneError when sold out");
    it.todo("should use transaction to prevent oversell");
  });
});

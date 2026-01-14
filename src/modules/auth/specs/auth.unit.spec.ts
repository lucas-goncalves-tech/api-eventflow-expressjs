import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "../auth.service";
import { ConflictError } from "../../../shared/errors/conflict.error";

describe("Auth Service UNIT", () => {
  const mockRepository = {
    create: vi.fn(),
    findByEmail: vi.fn(),
  };

  const service = new AuthService(mockRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create new user and return user data", async () => {
    const inputData = {
      email: "test@test.com",
      name: "testUser",
      password: "testtest",
    };

    const { password, ...rest } = inputData;
    const fakeUser = { id: "UUID", password_hash: "hash1234", ...rest };
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(fakeUser);
    const result = await service.register(inputData);

    expect(result).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("password_hash");
  });

  it("should throw ConflictError when send existing email", async () => {
    const inputData = {
      email: "test@test.com",
      name: "testUser",
      password: "testtest",
    };

    const existingUser = {
      id: "UUID",
      email: "test@test.com",
      name: "Existing User",
      password_hash: "hash1234",
    };

    mockRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(service.register(inputData)).rejects.toThrow(ConflictError);
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "../auth.service";
import { ConflictError } from "../../../shared/errors/conflict.error";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../../../shared/errors/unauthorized.error";

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
    const newCredentials = {
      email: "test@test.com",
      name: "testUser",
      password: "testtest",
    };

    const { password, ...rest } = newCredentials;
    const fakeUser = { id: "UUID", password_hash: "hash1234", ...rest };
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(fakeUser);
    const result = await service.register(newCredentials);

    expect(result).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("password_hash");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("name");
  });

  it("should throw ConflictError when send existing email", async () => {
    const email = "test@test.com";
    const newCredentials = {
      email,
      name: "testUser",
      password: "testtest",
    };

    const existingUser = {
      id: "UUID",
      email,
      name: "Existing User",
      password_hash: "hash1234",
    };

    mockRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(service.register(newCredentials)).rejects.toThrow(
      ConflictError
    );
  });

  it("should return JWT when credentials are valid", async () => {
    const email = "test@test.com";
    const password = "12345678";
    const validCredentials = {
      email,
      password,
    };
    const existingUser = {
      id: "UUID",
      email,
      name: "User",
      password_hash: await bcrypt.hash(password, 10),
    };
    mockRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(service.login(validCredentials)).resolves.toHaveProperty(
      "token"
    );
  });

  it("should throw UnauthorizedError when email nonexist", async () => {
    const credentials = {
      email: "nonexist@test.com",
      password: "12345678",
    };

    mockRepository.findByEmail.mockResolvedValue(null);
    await expect(service.login(credentials)).rejects.toThrow(UnauthorizedError);
  });

  it("should throw UnauthorizedError when only password is invalid", async () => {
    const email = "test@test.com";
    const credentials = {
      email,
      password: "wrongpassword",
    };
    const existingUser = {
      id: "UUID",
      email,
      name: "User",
      password_hash: await bcrypt.hash("12345678", 10),
    };

    mockRepository.findByEmail.mockResolvedValue(existingUser);
    await expect(service.login(credentials)).rejects.toThrow(UnauthorizedError);
  });
});

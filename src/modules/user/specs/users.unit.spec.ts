import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserService } from "../user.service";
import { generateFakeUser } from "../../../shared/helpers/user-spec.helper";

describe("Users Service unit", ()=> {
    const mockRepository = {
        findById: vi.fn()
    }
    const service = new UserService(mockRepository as any);

    beforeEach(()=>{
        vi.resetAllMocks()
    });

    it("should return user data when send user id", async ()=> {
        const { payload } = generateFakeUser();
        mockRepository.findById.mockResolvedValue(payload);
        const result = await service.me(payload.id);

        expect(result).toMatchObject({
            email: expect.any(String),
            name: expect.any(String),
            role: expect.any(String)
        });
        expect(result).not.toHaveProperty("id")
        expect(result).not.toHaveProperty("password_hash")
    })
})
import { describe, expect, it } from "vitest";
import request  from "supertest"
import { registerNewUser } from "../../../shared/helpers/auth-spec.helper";
import { container } from "tsyringe";
import { App } from "../../../app";

const BASE_URL = '/api/v1/users/me'
const AUTH_URL = '/api/v1/auth/';
const req = request(container.resolve(App).express)


describe("GET /api/v1/users/me", ()=> {
    it("should return status 200 with user data when send GET with valid cookie", async ()=> {
        const credentials = {
            email: "test@valid.com",
            password: "12345678"
        }

        await registerNewUser(AUTH_URL + "register", credentials);
        const loginRes = await req.post(AUTH_URL + "login").send(credentials);
        const cookies = loginRes.headers["set-cookie"]

        const result = await req.get(BASE_URL).set("Cookie", cookies)

        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({
            email: expect.any(String),
            name: expect.any(String),
            role: expect.any(String),
        })
        expect(result.body).not.toHaveProperty("id")
        expect(result.body).not.toHaveProperty("password_hash")
    });

    it("should return 401 when not send cookie", async ()=> {
        const result = await req.get(BASE_URL)

        expect(result.status).toBe(401)
        expect(result.body).toHaveProperty("message")
    })
})
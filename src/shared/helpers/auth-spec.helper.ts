
import request from "supertest";
import { container } from "tsyringe";
import { App } from "../../app";


export async function registerNewUser(override?: Record<string, unknown>) {
const req = request(container.resolve(App).express);

  return await req.post("/api/v1/auth/register").send({
    email: "test@test.com",
    name: "testUser",
    password: "12345678",
    confirmPassword: "12345678",
    ...override,
  });
}

import request from "supertest";
import { container } from "tsyringe";
import { App } from "../../app";


export async function registerNewUser(BASE_URL: string, override?: Record<string, unknown>) {
const req = request(container.resolve(App).express);

  return await req.post(`${BASE_URL}/register`).send({
    email: "test@test.com",
    name: "testUser",
    password: "12345678",
    confirmPassword: "12345678",
    ...override,
  });
}
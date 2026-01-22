import request, { agent } from "supertest";
import { container } from "tsyringe";
import { App } from "../../app";

const app = container.resolve(App).express;
export async function registerNewUser(override?: Record<string, unknown>) {
  const req = request(app);

  return await req.post("/api/v1/auth/register").send({
    email: "test@test.com",
    name: "testUser",
    password: "12345678",
    confirmPassword: "12345678",
    ...override,
  });
}

export async function authUser(userToBeLogged: "user" | "organizer" | "admin") {
  const reqAgent = agent(app);
  const email = `test@${userToBeLogged}.com`;
  const authResult = await reqAgent.post("/api/v1/auth/login").send({
    email,
    password: "12345678",
  });

  return { authResult, reqAgent };
}

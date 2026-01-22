import { expect } from "vitest";

export const generateNewEvent = (overrides?: Record<string, unknown>) => {
  const now = new Date();
  let starts_at = new Date(now);
  starts_at.setDate(now.getDate() + 7);
  let ends_at = new Date(now);
  ends_at.setDate(now.getDate() + 14);

  return {
    title: "Rock in Rio",
    description: "Insane show",
    location: "Some location",
    starts_at,
    ends_at,
    ...overrides,
  };
};

export function expectedEventShape(override?: Record<string, unknown>) {
  return {
    id: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
    starts_at: expect.anything(),
    ends_at: expect.anything(),
    location: expect.any(String),
    capacity: expect.any(Number),
    created_at: expect.anything(),
    ...override,
  };
}

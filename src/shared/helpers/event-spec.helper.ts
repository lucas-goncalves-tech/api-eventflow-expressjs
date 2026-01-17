export const generateNewEvent = (overrides?: Record<string, unknown>) => {
  const now = new Date();
  let starts_at = new Date(now);
  starts_at.setDate(now.getDate() + 7);
  let ends_at = new Date(now);
  ends_at.setDate(now.getDate() + 14);

  return {
    title: "Rock in Rio",
    description: "Insane show",
    starts_at,
    ends_at,
    ...overrides,
  };
};

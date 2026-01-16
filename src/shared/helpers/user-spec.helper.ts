export function generateFakeUser(override?: Record<string, unknown>) {
    const payload = {
        id: "UUID",
        email: "test@test.com",
        name: "Test User",
        role: "USER",
        password_hash: "hash1234",
        created_at: new Date(),
        ...override
    }

    return { payload }
}
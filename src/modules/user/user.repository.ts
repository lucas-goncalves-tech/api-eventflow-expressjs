import { inject, injectable } from "tsyringe";
import { DatabasePool } from "../../database/data-source";
import type { IUser, IUserInput, IUserRepository } from "./interface/user.interface";

@injectable()
export class UserRepository implements IUserRepository{
  constructor(@inject(DatabasePool) private readonly pool: DatabasePool) {}

    async findById(id: string): Promise<IUser | null> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
      );

      return result.rows[0] ?? null;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );

      return result.rows[0] ?? null;
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw error;
    }
  }

  async create(data: IUserInput): Promise<IUser | null> {
    try {
      const result = await this.pool.query(
        `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *`,
        [data.email, data.name, data.password_hash]
      );

      return result.rows[0] ?? null;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }
}

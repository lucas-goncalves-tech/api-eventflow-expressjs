import { injectable } from "tsyringe";
import { UserRepository } from "../user/user.repository";
import { inject } from "tsyringe";
import { env } from "../../core/config/env";
import bcrypt from "bcrypt";
import { ConflictError } from "../../shared/errors/conflict.error";
import type { ISignupInput, ISigninInput } from "./interface/auth.interface";
import { generateToken } from "../../shared/security/token.security";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";

@injectable()
export class AuthService {
  private readonly SALT: number;
  constructor(
    @inject(UserRepository) private readonly userRepository: UserRepository
  ) {
    this.SALT = env.SALT_ROUNDS;
  }

  async register(data: ISignupInput) {
    const userExist = await this.userRepository.findByEmail(data.email);
    if (userExist) {
      throw new ConflictError("Email já cadastrado");
    }
    const password_hashed = await bcrypt.hash(data.password, this.SALT);
    const user = await this.userRepository.create({
      email: data.email,
      name: data.name,
      password_hash: password_hashed,
    });
    if (!user) {
      throw new Error("Erro ao criar usuário");
    }
    const { password_hash, id, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: ISigninInput) {
    const userExist = await this.userRepository.findByEmail(data.email);
    if (!userExist) {
      throw new UnauthorizedError("Email ou senha inválidos");
    }
    const passwordMatch = await bcrypt.compare(
      data.password,
      userExist.password_hash
    );
    if (!passwordMatch) {
      throw new UnauthorizedError("Email ou senha inválidos");
    }

    return {
      token: generateToken({
        sid: userExist.id,
        role: userExist.role,
      }),
    };
  }
}

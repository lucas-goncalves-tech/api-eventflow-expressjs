import { inject, injectable } from "tsyringe";
import { UserRepository } from "./user.repository";

@injectable()
export class UserService {
    constructor(@inject(UserRepository) private readonly userRepository: UserRepository){}

    async me(userId: string){
        const user = await this.userRepository.findById(userId);

        const {id, password_hash, created_at, ...safeUser} = user!
        return safeUser
    }
}
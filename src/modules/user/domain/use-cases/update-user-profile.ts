import { User } from "../entities/user.entities";
import { IUserRepository } from "../repositories/user.repositories";

export class UpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User, id: number) {
    try {
        const updated_user = await this.userRepository.updateUser(user, id);
        return updated_user;
    } catch (error) {
      throw new Error(`Updation Failed: ${(error as Error).message}`);
    }
  }
}

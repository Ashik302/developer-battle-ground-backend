import { IUserRepository } from "../repositories/user.repositories";


export class GetUserProfileUseCase {
    constructor(
        private userRepository: IUserRepository,
    ){}

    async execute(id: number){
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Failed to get user profile: ${(error as Error).message}`)
        }
    }
}

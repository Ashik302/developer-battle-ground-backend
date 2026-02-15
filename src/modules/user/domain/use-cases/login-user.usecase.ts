import { User } from "../entities/user.entities";
import { IAuthProviderRepository } from "../repositories/auth-provider.repositories";
import { ITokenService } from "../repositories/token.repositories";
import { IUserRepository } from "../repositories/user.repositories";

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authProvider: IAuthProviderRepository,
    private tokenService: ITokenService,
  ) {}

  async execute(token: string) {
    try {
      let externalUser;
      try {
        console.log("this is token", token);
        externalUser = await this.authProvider.getUserInfo(token);
      } catch (error) {
        throw new Error(
          `Failed to fetch GitHub user info: ${(error as Error).message}`,
        );
      }

      if (!externalUser || !externalUser.email) {
        throw new Error("Invalid user data received from GitHub");
      }

      let user;
      user = await this.userRepository.findByEmail(externalUser.email);
      if (!user) {
        try {
          const newUser = new User(
            externalUser.name,
            externalUser.email,
            externalUser.location,
            externalUser.avatar_url,
            externalUser.github_url,
            externalUser.provider,
            externalUser.github_access_token,
          );
          user = await this.userRepository.create(newUser);
        } catch (error) {
          throw new Error(`Failed to create user: ${(error as Error).message}`);
        }
      }

      if (!user || !user.id || !user.email) {
        throw new Error("User object is invalid after creation/retrieval");
      }

      let accessToken;
      try {
        accessToken = this.tokenService.generate(
          { id: user.id, email: user.email },
          process.env.JWT_ACCESS_SECRET!,
          "1d",
        );
      } catch (error) {
        throw new Error(
          `Failed to generate access token: ${(error as Error).message}`,
        );
      }

      let refreshToken;
      try {
        refreshToken = this.tokenService.generate(
          { id: user.id },
          process.env.JWT_REFRESH_SECRET!,
          "7d",
        );
      } catch (error) {
        throw new Error(
          `Failed to generate refresh token: ${(error as Error).message}`,
        );
      }

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Login failed: ${(error as Error).message}`);
    }
  }
}

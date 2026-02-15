import { Request, Response } from "express";
import { LoginUserUseCase } from "../../domain/use-cases/login-user.usecase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repositories.impl";
import { UserSerializer } from "../serializers/user.serializers";
import { GithubAuthProvider } from "../../infrastructure/repositories/auth-provider.repositories.impl";
import { JwtTokenService } from "../../../../shared/utils/jwt-token.utils";
import { GetUserProfileUseCase } from "../../domain/use-cases/get-user-profile.usecase";
import { UpdateUserProfileUseCase } from "../../domain/use-cases/update-user-profile";
import { UpdateUserDTO } from "../dtos/update-user.dto";

const userRepository = new UserRepositoryImpl();
const getUserInformationRepository = new GithubAuthProvider(
  process.env.GITHUB_TOKEN_URL!,
  process.env.GITHUB_USER_URL!,
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
const getUserProfileUserCase = new GetUserProfileUseCase(userRepository);
const jwtToken = new JwtTokenService();
const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  getUserInformationRepository,
  jwtToken,
);

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { code: token } = req.body;

      if (!token) {
        return res.status(400).json({
          error: "Missing required field: token",
          message: "Authorization code is required",
        });
      }

      if (typeof token !== "string") {
        return res.status(400).json({
          error: "Invalid token format",
          message: "Token must be a string",
        });
      }

      let result;
      try {
        result = await loginUserUseCase.execute(token);
      } catch (useCaseError) {
        const errorMessage = (useCaseError as Error).message;
        console.error("Login use case error:", errorMessage);

        if (errorMessage.includes("GitHub")) {
          return res.status(401).json({
            error: "GitHub authentication failed",
            message: errorMessage,
          });
        }

        if (errorMessage.includes("token")) {
          return res.status(401).json({
            error: "Token validation failed",
            message: errorMessage,
          });
        }

        return res.status(500).json({
          error: "Authentication failed",
          message: errorMessage,
        });
      }

      if (!result || !result.user || !result.accessToken) {
        return res.status(500).json({
          error: "Invalid authentication result",
          message: "Could not complete authentication",
        });
      }

      return res.status(201).json({
        user: UserSerializer.serialize(result.user),
        access_token: result.accessToken,
        refresh_token: result.refreshToken || null,
      });
    } catch (error) {
      console.error("Unexpected controller error:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  }

  async getUserProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await getUserProfileUserCase.execute(req.user.id);

      return res.status(200).json({
        user: UserSerializer.serialize(user),
      });
    } catch (error) {
      console.error("Unexpected controller error:", error);

      return res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      // Create DTO instance and validate
      const updateUserDTO = new UpdateUserDTO(req.body);
      const { isValid, errors } = updateUserDTO.validate();

      if (!isValid) {
        return res.status(400).json({
          error: "Validation failed",
          message: "Invalid request data",
          details: errors,
        });
      }

      // Execute use case with validated data
      const updated_user = await updateUserProfileUseCase.execute(
        updateUserDTO?.toObject() as any,
        req.user?.id!,
      );

      return res.status(200).json({
        user: UserSerializer.serialize(updated_user),
      });
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  }
}

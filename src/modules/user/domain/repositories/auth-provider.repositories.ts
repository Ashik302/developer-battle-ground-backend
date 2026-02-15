import { AuthProvider } from "../entities/auth-provider.entities";

export interface IAuthProviderRepository {
  getUserInfo(token: string): Promise<AuthProvider>;
}

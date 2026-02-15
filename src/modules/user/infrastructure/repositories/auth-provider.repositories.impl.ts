import axios from "axios";
import { AuthProvider } from "../../domain/entities/auth-provider.entities";
import { IAuthProviderRepository } from "../../domain/repositories/auth-provider.repositories";

export class GithubAuthProvider implements IAuthProviderRepository {
  constructor(
    private github_token_url: string,
    private github_user_url: string,
    private client_id: string,
    private client_secret: string,
  ) {}

  async getUserInfo(code: string): Promise<AuthProvider> {
    try {
      if (!code) {
        throw new Error("Authorization code is required");
      }

      const tokenResponse = await axios.post(
        this.github_token_url,
        {
          client_id: this.client_id,
          client_secret: this.client_secret,
          code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      const accessToken = tokenResponse.data.access_token;

      if (!accessToken) {
        throw new Error("Failed to obtain access token from GitHub");
      }

      const [userResponse, emailsResponse] = await Promise.all([
        axios.get(this.github_user_url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        axios.get("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);

      const githubUser = userResponse.data;
      const emails = emailsResponse.data;

      const primaryEmail = emails.find(
        (email: any) => email.primary && email.verified,
      );

      if (!primaryEmail) {
        throw new Error("No verified primary email found in GitHub account.");
      }

      if (!githubUser.name) {
        throw new Error("GitHub user name is not available");
      }

      return {
        provider: "github",
        email: primaryEmail.email,
        name: githubUser.name,
        avatar_url: githubUser.avatar_url || "",
        github_url: githubUser.html_url || "",
        github_access_token: accessToken,
        location: githubUser.location || "", // optional
      };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `GitHub authentication error: ${error.response?.status} ${error.message}`,
        );
      }
      throw new Error(`GitHub authentication error: ${error.message}`);
    }
  }
}

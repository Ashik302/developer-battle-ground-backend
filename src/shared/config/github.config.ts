export const githubConfig = {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  tokenUrl: process.env.GITHUB_TOKEN_URL || "https://github.com/login/oauth/access_token",
  userUrl: process.env.GITHUB_USER_URL || "https://api.github.com/user",
};
export class AuthProvider {
  constructor(
    public provider: string,
    public email: string,
    public name: string,
    public avatar_url: string,
    public github_url: string,
    public github_access_token: string,
    public location: string,
  ) {}
}

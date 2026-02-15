  export class User {
    constructor(
      public name: string,
      public email: string,
      public location: string,
      public avatar_url: string,
      public github_url: string,
      public provider: string,
      public github_access_token: string,
      public lat?: string,
      public lng?: string,
      public id?: number,
    ) {}
  }

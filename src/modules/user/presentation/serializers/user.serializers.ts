import { User } from "../../domain/entities/user.entities";

export class UserSerializer {
  static serialize(user: User) {
    return {
      id: user.id,
      avatar_url: user.avatar_url,
      name: user.name,
      email: user.email,
      location: user.location,
      lat: user.lat,
      lng: user.lng,
      github_url: user.github_url,
    };
  }
}

import { User } from "../../domain/entities/user.entities";
import { IUserRepository } from "../../domain/repositories/user.repositories";
import { UserModel } from "../database/user.model";

export class UserRepositoryImpl implements IUserRepository {
  async create(user: User): Promise<User> {
    const { id, ...userWithoutId } = user;
    const created = await UserModel.create(userWithoutId);
    return new User(
      created.name,
      created.email,
      created.location,
      created.avatar_url,
      created.github_url,
      created.provider,
      created.github_access_token,
      created.lat,
      created.lng,
      created.id,
    );
  }

async updateUser(user: User, id: number): Promise<User> {
  const { id: userId, ...userWithoutId } = user;
  await UserModel.update(
    userWithoutId,
    { where: { id } }
  );

  const updated_user_instance = await UserModel.findOne({ where: { id } });
  if (!updated_user_instance) throw new Error("User not found after update");

  return new User(
    updated_user_instance.name,
    updated_user_instance.email,
    updated_user_instance.location,
    updated_user_instance.avatar_url,
    updated_user_instance.github_url,
    updated_user_instance.provider,
    updated_user_instance.github_access_token,
      updated_user_instance.lat,
      updated_user_instance.lng,
      updated_user_instance.id,
  );
}

  async findByEmail(email: string): Promise<User | null> {
    const found = await UserModel.findOne({ where: { email } });
    if (!found) return null;

    return new User(
      found.name,
      found.email,
      found.location,
      found.avatar_url,
      found.github_url,
      found.provider,
      found.github_access_token,
      found.lat,
      found.lng,
      found.id,
    );
  }
  
  async findById(id: number): Promise<User | null> {
    const found = await UserModel.findOne({ where: { id } });
    if (!found) return null;
    
    return new User(
      found.name,
      found.email,
      found.location,
      found.avatar_url,
      found.github_url,
      found.provider,
      found.github_access_token,
      found.lat,
      found.lng,
      found.id,
    );
  }
}

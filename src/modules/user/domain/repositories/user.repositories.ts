import { User } from "../entities/user.entities";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  updateUser(user: User, id:number): Promise<User>;
  findById(id: number): Promise<User | null>;
}

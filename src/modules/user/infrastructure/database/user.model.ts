import { DataTypes, Model, Optional } from "sequelize";
import { sequalize } from "../../../../shared/database/sequalize";

interface UserAttributes {
  id: number;
  avatar_url: string;
  name: string;
  email: string;
  location: string;
  github_url: string;
  github_access_token: string;
  provider: string;
  lat?: string;
  lng?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public avatar_url!: string;
  public name!: string;
  public email!: string;
  public location!: string;
  public github_url!: string;
  public github_access_token!: string;
  public provider!: string;
  public lat?: string;
  public lng?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    github_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github_access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequalize,
    tableName: "users",
    timestamps: true,
  },
);

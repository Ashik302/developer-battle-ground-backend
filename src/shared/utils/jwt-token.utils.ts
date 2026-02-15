import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../modules/user/domain/repositories/token.repositories";

export class JwtTokenService implements ITokenService {
  generate(payload: object, secret: string, expiresIn: string): string {
    const options: SignOptions = {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"]
    };
    return jwt.sign(payload, secret, options);
  }

  verify(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }
}
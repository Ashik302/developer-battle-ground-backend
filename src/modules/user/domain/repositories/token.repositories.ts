export interface ITokenService {
  generate(payload: object, secret: string, expiresIn: string): string;
  verify(token: string, secret: string): any;
}

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "src/features/auth/auth.service";

const cookieExtractor = (request: any): string | null => {
  const cookieHeader = request?.headers?.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie: string) => cookie.trim());
  const tokenCookie = cookies.find((cookie: string) =>
    cookie.startsWith("access_token="),
  );

  if (!tokenCookie) return null;
  return decodeURIComponent(tokenCookie.split("=").slice(1).join("="));
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    if (this.authService.isJwtRevoked(payload.jti)) return false;
    return await this.authService.validateJwt(payload.sub);
  }
}

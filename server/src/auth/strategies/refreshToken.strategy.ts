import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_JWT_SECRET as string,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const refreshToken = authHeader.replace("Bearer", "").trim();

    console.log(refreshToken);

    return { ...payload, refreshToken };
  }
}

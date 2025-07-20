import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as cookie from "cookie";

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const { cookie: rawCookie } = client.handshake.headers;

    if (!rawCookie) {
      throw new UnauthorizedException("No cookie header");
    }

    const parsedCookies = cookie.parse(rawCookie);
    const token = parsedCookies["access_token"];

    if (!token) {
      throw new UnauthorizedException("No access_token cookie");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_JWT_SECRET,
      });

      // можно повесить user прямо на клиента:
      client.user = payload;
    } catch (e) {
      console.error("JWT verification failed:", e);
      throw new UnauthorizedException("Invalid token");
    }

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as cookie from "cookie";
import { Socket } from "socket.io";

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const rawCookie = client.handshake.headers?.cookie;

    if (typeof rawCookie !== "string") {
      throw new UnauthorizedException("No cookie header");
    }

    const parsedCookies = cookie.parse(rawCookie);
    const token = parsedCookies["access_token"];

    console.log(token);

    if (!token) {
      throw new UnauthorizedException("No access_token");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_JWT_SECRET,
      });

      client.data.user = payload;
      return true;
    } catch (e) {
      console.error("JWT verification failed:", e);
      throw new UnauthorizedException("Invalid token");
    }
  }
}

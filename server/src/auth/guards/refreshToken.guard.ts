import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: REFRESH_JWT_SECRET,
      });

      if (!payload) {
        throw new UnauthorizedException();
      }

      request.user = {
        user_id: payload.user_id,
        ...payload,
        token: token,
      };
    } catch (e) {
      console.error("JWT error:", e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}

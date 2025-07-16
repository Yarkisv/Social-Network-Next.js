import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { LoginDto } from "./dto/create-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const email = loginDto.email;
      const password = loginDto.password;

      const user = await this.userService.findOne(email);

      console.log("User:", user);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const isPassMatch = await argon2.verify(user.password, password);

      if (!isPassMatch) {
        throw new UnauthorizedException("Invalid password");
      }

      const tokens = await this.getTokens(
        user.user_id,
        user.username,
        user.email
      );

      return tokens;
    } catch (err) {
      console.error("Login error:", err);
      throw new UnauthorizedException("Login failed");
    }
  }

  async refreshTokens(refreshToken: string) {
    const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: REFRESH_JWT_SECRET,
      });

      const user_id = payload.user_id;
      const username = payload.username;
      const email = payload.email;

      const user = await this.userService.findById(user_id);
      if (!user) throw new ForbiddenException("Access Denied");

      const { access_token, refresh_token } = await this.getTokens(
        user_id,
        username,
        email
      );

      return { access_token, refresh_token };
    } catch (err) {
      throw new ForbiddenException(`Access Denied: ${err}`);
    }
  }

  async getTokens(user_id: number, username: string, email: string) {
    const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
    const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

    const payload = {
      user_id,
      username,
      email,
    };

    const [access_token, refresh_token] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: ACCESS_JWT_SECRET,
        expiresIn: "1h",
      }),

      await this.jwtService.signAsync(payload, {
        secret: REFRESH_JWT_SECRET,
        expiresIn: "7d",
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}

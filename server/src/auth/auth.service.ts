import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    try {
      const user = await this.userService.findOne(email);

      console.log("User:", user);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const isPassMatch = await argon2.verify(user.password, password);

      if (!isPassMatch) {
        throw new UnauthorizedException("Invalid password");
      }

      const payload = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      console.error("Login error:", err);
      throw new UnauthorizedException("Login failed");
    }
  }
}

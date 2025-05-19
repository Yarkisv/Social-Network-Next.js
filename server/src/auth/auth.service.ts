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
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPassMatch = await argon2.verify(user.password, password);

    const payload = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    };

    if (user && isPassMatch) {
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }
}

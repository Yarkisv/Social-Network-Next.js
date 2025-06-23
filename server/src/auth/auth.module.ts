import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { AuthGuard } from "./guards/auth.guard";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthGuard,
  ],
  imports: [UserModule, JwtModule.register({})],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}

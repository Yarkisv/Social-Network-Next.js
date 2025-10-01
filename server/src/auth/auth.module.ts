import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { AuthGuard } from "./guards/auth.guard";
import { PostModule } from "src/post/post.module";
import { SubscriptionModule } from "src/subscription/subscription.module";
import { LikeModule } from "src/like/like.module";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthGuard,
  ],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({}),
    forwardRef(() => PostModule),
    SubscriptionModule,
  ],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}

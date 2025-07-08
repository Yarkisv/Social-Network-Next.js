import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { AccessTokenStrategy } from "src/auth/strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "src/auth/strategies/refreshToken.strategy";
import { AuthModule } from "src/auth/auth.module";
import { Subscription } from "./entities/subscription.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { FileService } from "src/services/file.service";
import { UserService } from "src/user/user.service";

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Subscription]), AuthModule],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    FileService,
  ],
})
export class SubscriptionModule {}

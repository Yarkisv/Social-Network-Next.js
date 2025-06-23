import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { AccessTokenStrategy } from "src/auth/strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "src/auth/strategies/refreshToken.strategy";
import { AuthModule } from "src/auth/auth.module";
import { Subscription } from "./entities/subscription.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), AuthModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class SubscriptionModule {}

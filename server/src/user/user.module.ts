import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { FileService } from "src/services/file.service";
import { AuthModule } from "src/auth/auth.module";
import { SubscriptionModule } from "src/subscription/subscription.module";
import { PostModule } from "src/post/post.module";
import { SavedPostsModule } from "src/saved-posts/saved-posts.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => PostModule),
    forwardRef(() => SavedPostsModule),
  ],
  controllers: [UserController],
  providers: [UserService, FileService],
  exports: [UserService],
})
export class UserModule {}

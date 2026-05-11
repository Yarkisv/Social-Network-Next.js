import { forwardRef, Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { FileService } from "src/services/file.service";
import { UserModule } from "src/user/user.module";
import { LikeModule } from "src/like/like.module";
import { AuthModule } from "src/auth/auth.module";
import { AiModule } from "src/ai/ai.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    forwardRef(() => UserModule),
    forwardRef(() => LikeModule),
    forwardRef(() => AuthModule),
    AiModule,
  ],
  controllers: [PostController],
  providers: [PostService, FileService],
  exports: [PostService],
})
export class PostModule {}

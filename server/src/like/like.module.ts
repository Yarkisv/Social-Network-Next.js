import { forwardRef, Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./entities/like.entity";
import { Post } from "src/post/entities/post.entity";
import { AuthModule } from "src/auth/auth.module";
import { FileService } from "src/services/file.service";

@Module({
  controllers: [LikeController],
  providers: [LikeService, FileService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Like, Post]),
  ],
  exports: [LikeService],
})
export class LikeModule {}

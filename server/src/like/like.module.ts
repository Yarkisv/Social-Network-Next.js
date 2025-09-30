import { Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./entities/like.entity";
import { Post } from "src/post/entities/post.entity";

@Module({
  controllers: [LikeController],
  providers: [LikeService],
  imports: [AuthModule, TypeOrmModule.forFeature([Like, Post])],
})
export class LikeModule {}

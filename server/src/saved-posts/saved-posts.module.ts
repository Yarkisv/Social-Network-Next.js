import { Module } from "@nestjs/common";
import { SavedPostsService } from "./saved-posts.service";
import { SavedPostsController } from "./saved-posts.controller";
import { AuthModule } from "src/auth/auth.module";
import { LikeModule } from "src/like/like.module";
import { SavedPost } from "./entities/saved-post.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([SavedPost]), AuthModule, LikeModule],
  controllers: [SavedPostsController],
  providers: [SavedPostsService],
  exports: [SavedPostsService],
})
export class SavedPostsModule {}

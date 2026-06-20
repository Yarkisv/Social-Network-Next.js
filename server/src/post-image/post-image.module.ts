import { Module } from "@nestjs/common";
import { PostImageService } from "./post-image.service";
import { PostImageController } from "./post-image.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostImage } from "./entities/post-image.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PostImage])],
  controllers: [PostImageController],
  providers: [PostImageService],
  exports: [PostImageService],
})
export class PostImageModule {}

import { Module } from '@nestjs/common';
import { PostImageService } from './post-image.service';
import { PostImageController } from './post-image.controller';

@Module({
  controllers: [PostImageController],
  providers: [PostImageService],
})
export class PostImageModule {}

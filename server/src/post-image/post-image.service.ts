import { Injectable } from "@nestjs/common";
import { CreatePostImageDto } from "./dto/create-post-image.dto";
import { UpdatePostImageDto } from "./dto/update-post-image.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostImage } from "./entities/post-image.entity";

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async removePostImagesByPostId(post_id: number) {
    await this.postImageRepository.delete({ post: { post_id: post_id } });
  }
}

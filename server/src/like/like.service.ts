import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateLikeDto } from "./dto/create-like.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "./entities/like.entity";
import { Repository } from "typeorm";
import { Post } from "src/post/entities/post.entity";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) {}

  async create(createLikeDto: CreateLikeDto, user_id: number) {
    const post = await this.postRepository.findOne({
      where: {
        post_id: createLikeDto.post_id,
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const isLikeAlreadyExists = await this.likeRepository.findOne({
      where: {
        post: { post_id: createLikeDto.post_id },
        user: { user_id: user_id },
      },
    });

    if (isLikeAlreadyExists) {
      throw new ConflictException(
        `Like already liked by this user: [${user_id}]`
      );
    }

    const like = await this.likeRepository.save({
      post: { post_id: createLikeDto.post_id },
      user: { user_id: user_id },
    });

    return like;
  }
}

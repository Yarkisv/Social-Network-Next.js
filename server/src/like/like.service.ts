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
import { FileService } from "src/services/file.service";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly fileService: FileService
  ) {}

  async likePost(createLikeDto: CreateLikeDto, user_id: number) {
    const post = await this.postRepository.findOne({
      where: {
        post_id: createLikeDto.post_id,
      },
    });

    if (!post) {
      console.log("Post not found");

      throw new NotFoundException("Post not found");
    }

    const isLikeAlreadyExists = await this.likeRepository.findOne({
      where: {
        post: { post_id: createLikeDto.post_id },
        user: { user_id: user_id },
      },
    });

    if (isLikeAlreadyExists) {
      console.log("User already liked this post");

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

  async findAllLikesByPost(post_id: number) {
    const likes = await this.likeRepository.find({
      where: {
        post: { post_id: post_id },
      },
      relations: ["user"],
    });

    if (!likes) {
      console.log("Likes not found");
    }

    const modifiedLikes = await Promise.all(
      likes.map(async (like) => {
        const { user, ...rest } = like;

        const likedByAvatarBase64 = await this.fileService.getFile(
          user.avatarPathTo
        );

        return {
          ...rest,
          likedByUserAvatarBase64: likedByAvatarBase64,
          likedByUserUsername: user.username,
        };
      })
    );

    // console.log(`Likes of post ${post_id}: ${JSON.stringify(likes, null, 2)}`);
    // console.log(`Modified likes: ${JSON.stringify(modifiedLikes, null, 2)}`);

    return modifiedLikes;
  }
}

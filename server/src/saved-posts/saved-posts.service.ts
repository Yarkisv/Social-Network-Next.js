import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SavedPost } from "./entities/saved-post.entity";
import { Repository } from "typeorm";
import { LikeService } from "../like/like.service";

@Injectable()
export class SavedPostsService {
  constructor(
    @InjectRepository(SavedPost)
    private readonly savedPostRepository: Repository<SavedPost>,
    private readonly likeService: LikeService,
  ) {}

  async create(user_id: number, post_id: number) {
    const savedPost = await this.savedPostRepository.save({
      user: { user_id: user_id },
      post: { post_id: post_id },
    });

    return savedPost;
  }

  async getAllSavedPostsByUser(user_id: number) {
    const savedPosts = await this.savedPostRepository.find({
      where: { user: { user_id: user_id } },
      relations: ["user", "post", "post.images"],
    });

    const modifiedPosts = await Promise.all(
      savedPosts.map(async (savedPost) => {
        const { user, post } = savedPost;

        const likes = await this.likeService.findAllLikesByPost(
          savedPost.post.post_id,
        );

        return {
          post_id: post.post_id,
          images: post.images,
          post_title: post.post_title,
          hashtag: post.hashtag,
          comments: post.comments,
          likes,
          userAvatar: user.avatarPathTo,
          username: user.username,
        };
      }),
    );

    return modifiedPosts;
  }
}

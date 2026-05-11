import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "./entities/post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { LikeService } from "src/like/like.service";
import { AiService } from "../ai/ai.service";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly likeService: LikeService,
    private readonly aiService: AiService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { user_id, post_title, hashtag, contentPathsTo } = createPostDto;

    const user = await this.userService.findFullDataById(user_id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const aiInputText = `${post_title}`;

    const aiTags = await this.aiService.generateTags(aiInputText);

    console.log(aiTags);

    const post = await this.postRepository.save({
      post_title,
      aiTags,
      user: { user_id: user.user_id },
      images: contentPathsTo.map((path) => ({
        path_to: path,
      })),
    });
  }

  async findUserPostsById(user_id: number) {
    const user = await this.userService.findFullDataById(user_id);
    const posts: Post[] = await this.postRepository.find({
      where: {
        user: { user_id: user.user_id },
      },
      relations: ["images", "comments"],
    });

    const modifiedPosts = await Promise.all(
      posts.map(async (post) => {
        const likes = await this.likeService.findAllLikesByPost(post.post_id);

        return {
          ...post,
          userAvatar: user.avatarPathTo,
          username: user.username,
          likes,
        };
      }),
    );

    return modifiedPosts;
  }
}

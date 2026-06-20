import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "./entities/post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { LikeService } from "src/like/like.service";
import { AiService } from "../ai/ai.service";
import { PostImageService } from "../post-image/post-image.service";
import { CommentService } from "src/comment/comment.service";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly likeService: LikeService,
    private readonly aiService: AiService,
    private readonly PostImageService: PostImageService,
    private readonly commentService: CommentService,
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

  async deletePost(user_id: number, post_id: number) {
    console.log(user_id, post_id);

    const post = await this.postRepository.findOne({
      where: {
        post_id: post_id,
        user: { user_id: user_id },
      },
      relations: ["images", "comments", "likes"],
    });

    if (!post) {
      throw new Error("Post not found or unauthorized");
    }

    if (post.images && post.images.length > 0) {
      await this.PostImageService.removePostImagesByPostId(post_id);
    }

    if (post.comments && post.comments.length > 0) {
      await this.commentService.deleteAllCommentsFromPostByPostId(post_id);
    }

    if (post.likes && post.likes.length > 0) {
      await this.likeService.deleteAllLikesFromPostByPostId(post_id);
    }

    await this.postRepository.remove(post);

    return { success: true };
  }
}

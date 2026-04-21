import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "./entities/post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { FileService } from "src/services/file.service";
import { LikeService } from "src/like/like.service";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly likeService: LikeService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { user_id, post_title, hashtag, contentPathsTo } = createPostDto;

    const user = await this.userService.findFullDataById(user_id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const post = await this.postRepository.save({
      post_title,
      hashtag,
      user,
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
      relations: ["images"],
    });

    const modifiedPosts = await Promise.all(
      posts.map(async (post) => {
        const { images, ...rest } = post;

        const modifiedImages = await Promise.all(
          images.map(async (image) => {
            return await this.fileService.getFile(image.path_to);
          }),
        );

        const likes = await this.likeService.findAllLikesByPost(post.post_id);

        return {
          ...rest,
          userAvatar: user.avatarBase64,
          username: user.username,
          images: modifiedImages,
          likes,
        };
      }),
    );
    return modifiedPosts;
  }
}

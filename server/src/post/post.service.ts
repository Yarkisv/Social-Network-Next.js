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
    private readonly likeService: LikeService
  ) {}

  async create(createPostDto: CreatePostDto) {
    const user_id = createPostDto.user_id;
    const title = createPostDto.post_title;
    const pathTo = createPostDto.contentPathTo;

    console.log(`User id from service ${user_id}`);
    console.log(`File path from service ${pathTo}`);

    const user = await this.userService.findFullDataById(user_id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const post = await this.postRepository.save({
      contentPathTo: pathTo,
      post_title: title,
      user: user,
    });
  }

  async findUserPostsById(user_id: number) {
    const user = await this.userService.findFullDataById(user_id);

    const posts: Post[] = await this.postRepository.find({
      where: {
        user: { user_id: user.user_id },
      },
    });

    console.log(posts);

    const modifiedPosts = await Promise.all(
      posts.map(async (post) => {
        const { contentPathTo, ...rest } = post;
        const imageBase64 = await this.fileService.getFile(post.contentPathTo);
        const likes = await this.likeService.findAllLikesByPost(post.post_id);

        return {
          ...rest,
          userAvatar: user.avatarBase64,
          username: user.username,
          imageBase64,
          likes,
        };
      })
    );

    console.log(JSON.stringify(modifiedPosts, null, 2));

    return modifiedPosts;
  }
}

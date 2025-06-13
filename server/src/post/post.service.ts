import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "./entities/post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { FileService } from "src/services/file.service";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {}

  async create(createPostDto: CreatePostDto) {
    const user_id = createPostDto.user_id;
    const pathTo = createPostDto.contentPathTo;

    console.log(`User id from service ${user_id}`);
    console.log(`File path from service ${pathTo}`);

    const user = await this.userService.findById(user_id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const post = await this.postRepository.save({
      contentPathTo: pathTo,
      user: user,
    });
  }

  async findUserPostsById(user_id: number) {
    const user = await this.userService.findById(user_id);

    console.log(user);

    const posts: Post[] = await this.postRepository.find({
      where: {
        user: { user_id: user.user_id },
      },
      relations: ["user"],
    });

    console.log(posts);

    const postsBase64 = await Promise.all(
      posts.map((post) => this.fileService.getFile(post.contentPathTo))
    );

    return postsBase64;
  }
}

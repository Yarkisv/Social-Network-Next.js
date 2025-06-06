import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "./entities/post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) {}

  create(createPostDto: CreatePostDto) {
    return "This action adds a new post";
  }

  async findUserPostsById(user: User) {
    return await this.postRepository.find({
      where: {
        user: user,
      },
    });
  }
}

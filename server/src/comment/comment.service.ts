import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entities/comment.entity";
import { Repository } from "typeorm";
import { FileService } from "src/services/file.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly fileService: FileService
  ) {}

  async create(id: number, createCommentDto: CreateCommentDto) {
    const comment = await this.commentRepository.save({
      content: createCommentDto.content,
      post: { post_id: createCommentDto.post_id },
      user: { user_id: id },
    });

    return comment;
  }

  async findAllByPostId(id: number) {
    const comments = await this.commentRepository.find({
      where: {
        post: { post_id: id },
      },
      relations: ["user"],
    });

    const modifiedComments = await Promise.all(
      comments.map(async (comment) => {
        const { user, post, ...rest } = comment;

        const senderUsername = user.username;
        const senderAvatarBase64 = await this.fileService.getFile(
          user.avatarPathTo
        );

        return { senderUsername, senderAvatarBase64, ...rest };
      })
    );

    console.log(modifiedComments);

    return modifiedComments;
  }
}

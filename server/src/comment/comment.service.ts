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
    private readonly fileService: FileService,
  ) {}

  async create(id: number, createCommentDto: CreateCommentDto) {
    const now = new Date();

    const comment = await this.commentRepository.save({
      content: createCommentDto.content,
      post: { post_id: createCommentDto.post_id },
      user: { user_id: id },
      send_at: now,
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

        return {
          senderUsername,
          senderAvatarPathTo: user.avatarPathTo,
          ...rest,
        };
      }),
    );

    return modifiedComments;
  }

  async findAllByUserId(id: number) {
    const comments = await this.commentRepository.find({
      where: { user: { user_id: id } },
      relations: ["post", "post.images", "user"],
    });

    const modifiedComments = comments.map((comment) => {
      return {
        comment_id: comment.comment_id,
        content: comment.content,
        likes: comment.likes,
        sent_at: comment.sent_at,
        post: {
          post_id: comment.post.post_id,
          post_title: comment.post.post_title,
          hashtag: comment.post.hashtag,
          images: comment.post.images,
        },
        avatarPathTo: comment.user.avatarPathTo,
      };
    });

    return modifiedComments;
  }
}

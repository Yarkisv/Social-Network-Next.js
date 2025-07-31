import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post("new")
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const id = req.user.user_id;

    console.log(`User with id: [${id}] saves comment`);

    return this.commentService.create(id, createCommentDto);
  }

  @Get("/get/all/:id")
  async getCommentsByPostId(@Param("id") id: number) {
    console.log(id);

    return await this.commentService.findAllByPostId(id);
  }
}

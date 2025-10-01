import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { LikeService } from "./like.service";
import { CreateLikeDto } from "./dto/create-like.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("like")
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Post("create")
  create(@Body() createLikeDto: CreateLikeDto, @Request() req) {
    const user_id = req.user.user_id;

    console.log(
      `User with id ${user_id} trying like post with id ${createLikeDto.post_id}`
    );

    return this.likeService.likePost(createLikeDto, user_id);
  }
}

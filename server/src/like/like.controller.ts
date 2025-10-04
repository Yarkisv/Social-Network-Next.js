import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Delete,
} from "@nestjs/common";
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

  @UseGuards(AuthGuard)
  @Get("/check-is-already-liked/:post_id")
  async isAlreadyLikedByUser(
    @Param("post_id") post_id: number,
    @Request() req
  ) {
    const user_id = req.user.user_id;

    console.log("checking");

    return this.likeService.isAlreadyLikedByUser(user_id, post_id);
  }

  @UseGuards(AuthGuard)
  @Delete("delete/:post_id")
  async deleteLike(@Param("post_id") post_id: number, @Request() req) {
    const user_id = req.user.user_id;

    const { like_id } = await this.likeService.deleteLike(user_id, post_id);
    console.log(like_id);
    return like_id;
  }
}

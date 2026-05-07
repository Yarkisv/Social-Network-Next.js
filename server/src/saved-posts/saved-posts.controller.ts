import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { SavedPostsService } from "./saved-posts.service";
import { CreateSavedPostDto } from "./dto/create-saved-post.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("saved-posts")
export class SavedPostsController {
  constructor(private readonly savedPostsService: SavedPostsService) {}

  @UseGuards(AuthGuard)
  @Post("new")
  async create(@Body() createSavedPostDto: CreateSavedPostDto, @Request() req) {
    const user_id = req.user.user_id;
    const post_id = createSavedPostDto.post_id;

    return await this.savedPostsService.create(user_id, post_id);
  }

  @UseGuards(AuthGuard)
  @Get("get-all")
  async getAllUserSavedPosts(@Request() req) {
    const user_id = req.user.user_id;

    const saved_posts =
      await this.savedPostsService.getAllSavedPostsByUser(user_id);

    return saved_posts;
  }
}

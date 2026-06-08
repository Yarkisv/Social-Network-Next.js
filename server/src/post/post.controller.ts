import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
  Get,
  Param,
  UploadedFiles,
  UseGuards,
  Request,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { FileService } from "src/services/file.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreatePostDto } from "./dto/create-post.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("post")
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly fileService: FileService,
  ) {}

  @Post("upload/post")
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor("files", 10))
  async uploadFile(
    @Body() createPostDto: CreatePostDto,
    @Body("folder") folder: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);

    const paths = await Promise.all(
      files.map((file) => this.fileService.uploadFile(file, folder)),
    );

    console.log(paths);

    createPostDto.contentPathsTo = paths;

    await this.postService.create(createPostDto);

    return { message: "Post uploaded successfuly" };
  }

  @Get("get/:id")
  async getPostsById(@Param("id") id: number) {
    return this.postService.findUserPostsById(id);
  }

  @UseGuards(AuthGuard)
  @Get("get-all")
  async getAllPosts(@Request() req) {
    const id = req.user.user_id;

    const posts = await this.postService.findUserPostsById(id);

    return posts;
  }
}

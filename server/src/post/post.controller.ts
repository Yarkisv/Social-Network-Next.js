import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { FileService } from "src/services/file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreatePostDto } from "./dto/create-post.dto";

@Controller("post")
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly fileService: FileService
  ) {}

  @Post("upload/post")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @Body() createPostDto: CreatePostDto,
    @Body("folder") folder: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log(file);
    console.log(folder);

    const pathTo = await this.fileService.uploadFile(file, folder);

    createPostDto.contentPathTo = pathTo;

    await this.postService.create(createPostDto);

    return { message: "Post uploaded successfuly" };
  }

  @Post("upload/posts")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFiles(@UploadedFile() files: Express.Multer.File[]) {
    console.log(files);
  }

  @Get("get/:id")
  async getPostsById(
    @Param("id") id: number
  ) {
    return this.postService.findUserPostsById(id);
  }
}

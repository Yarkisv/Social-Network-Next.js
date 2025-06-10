import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { FileService } from "src/services/file.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("post")
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly fileService: FileService
  ) {}

  @Post("upload/post")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    return this.fileService.uploadFile(file);
  }

  @Post("upload/posts")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFiles(@UploadedFile() files: Express.Multer.File[]) {
    console.log(files);
  }
}

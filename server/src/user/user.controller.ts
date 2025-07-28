import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("username/:username")
  async findByUsername(@Param("username") username: string) {
    return this.userService.findByUsername(username);
  }

  @Get("usernames/:string")
  async findByString(@Param("string") string: string) {
    console.log("username");

    return this.userService.findUsersBySymbol(string);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Patch("update")
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    const id = req.user.user_id;

    console.log(`User id: [${id}] trying to update data`);

    return this.userService.updateUser(id, updateUserDto, file);
  }
}

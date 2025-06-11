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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("all")
  async findAll() {
    return await this.userService.findAll();
  }

  @Get("username/:username")
  async findByUsername(@Param("username") username: string) {
    return this.userService.findByUsername(username);
  }

  @Get("usernames/:string")
  async findByString(@Param("string") string: string) {
    return this.userService.findUsersBySymbol(string);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Patch("update/:id")
  async updateUser(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto
    // file: Express.Multer.File
  ) {
    console.log(id);

    return this.userService.updateUser(id, updateUserDto);
  }
}

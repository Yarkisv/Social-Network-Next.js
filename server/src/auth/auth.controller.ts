import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/create-auth.dto";
import { AuthGuard } from "./auth.guard";
import { UserService } from "src/user/user.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userServise: UserService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    console.log(loginDto);

    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  profile(@Request() req) {
    const id: number = req.user.user_id;

    console.log("AGagag");

    return this.userServise.findById(id);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/create-auth.dto";
import { AuthGuard } from "./guards/auth.guard";
import { UserService } from "src/user/user.service";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userServise: UserService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { access_token, refresh_token } =
      await this.authService.login(loginDto);

    response.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    response.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: "Login successful" };
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  profile(@Request() req) {
    const id: number = req.user.user_id;

    return this.userServise.findById(id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  refreshTokens(@Request() req) {
    const refreshToken = req.user.token;

    return this.authService.refreshTokens(refreshToken);
  }
}

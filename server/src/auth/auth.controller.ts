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
  UnauthorizedException,
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

  @UseGuards(AuthGuard)
  @Get("profile")
  profile(@Request() req) {
    const id: number = req.user.user_id;

    console.log(id);

    return this.userServise.findById(id);
  }

  @UseGuards(AuthGuard)
  @Get("/check-token")
  async checkToken(@Request() req) {
    const token = req.user.token;

    if (!token) {
      throw new UnauthorizedException("Not authorized");
    }

    return { message: "Token valid" };
  }

  @UseGuards(AuthGuard)
  @Get("logout")
  async logout(@Request() req, @Res() response: Response) {
    const token = req.user.token;

    if (!token) {
      throw new UnauthorizedException("Not authorized");
    }

    response.clearCookie("access_token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    response.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return response.status(200).json({ message: "Logout successful" });
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  async refreshTokens(
    @Request() req,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = req.user.token;

    console.log("Refresh token from request: ", refreshToken);

    const { access_token, refresh_token } =
      await this.authService.refreshTokens(refreshToken);

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
  }
}

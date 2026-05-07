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
  Param,
  NotFoundException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/create-auth.dto";
import { AuthGuard } from "./guards/auth.guard";
import { UserService } from "src/user/user.service";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";
import { Response } from "express";
import { PostService } from "src/post/post.service";
import { SubscriptionService } from "src/subscription/subscription.service";
import { SavedPostsService } from "../saved-posts/saved-posts.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    // private readonly postService: PostService,
    // private readonly subscriptionService: SubscriptionService,
    // private readonly savedPostsService: SavedPostsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
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

    console.log("Login successful");

    return { message: "Login successful" };
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async me(@Request() req) {
    const id: number = req.user.user_id;

    const user = await this.userService.findBasicDataById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  // @UseGuards(AuthGuard)
  // @Get("get-full/:username")
  // async getFullUserData(@Param("username") username: string, @Request() req) {
  //   const currnet_user_id = req.user.user_id;

  //   const user = await this.userService.findByUsername(username);

  //   if (!user) {
  //     throw new NotFoundException("User not found");
  //   }

  //   const isOwner = currnet_user_id === user.user_id;

  //   let subscription;

  //   if (currnet_user_id) {
  //     subscription = await this.subscriptionService.findOneSubscription(
  //       currnet_user_id,
  //       user.user_id,
  //     );
  //   }

  //   const isSubscribed = subscription?.status === "accepted";
  //   const isPending = subscription?.status === "pending";

  //   const canViewPosts = !user.isPrivate || isOwner || isSubscribed;

  //   const posts = canViewPosts
  //     ? await this.postService.findUserPostsById(user.user_id)
  //     : [];

  //   const savedPosts = isOwner
  //     ? await this.savedPostsService.getAllSavedPostsByUser(currnet_user_id)
  //     : [];

  //   const showSubsInfo = !user.isPrivate || isOwner || isSubscribed;

  //   const { subscriptions, subscribers } = showSubsInfo
  //     ? await this.subscriptionService.findAllById(user.user_id)
  //     : {
  //         subscriptions: [],
  //         subscribers: [],
  //       };

  //   const data = {
  //     user,
  //     posts,
  //     subscriptions,
  //     subscribers,
  //     isPrivate: user.isPrivate,
  //     isSubscribed,
  //     isPending,
  //   };

  //   return data;
  // }

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
  @Post("refresh")
  async refreshTokens(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log("/auth/refresh called");

    const refreshToken = req.user.token;

    console.log("Refresh token from request: ", refreshToken);

    const { access_token, refresh_token } =
      await this.authService.refreshTokens(refreshToken);

    console.log(
      `New access token: [${access_token}]\n New refresh token : [${refresh_token}]`,
    );

    response.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    response.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log("Tokens refreshed successfuly");

    return {
      access_token,
      refreshToken,
    };
  }
}

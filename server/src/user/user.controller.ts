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
  Query,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { EPeriods } from "src/enums/statistics-period.enum";
import { PostService } from "src/post/post.service";
import { SubscriptionService } from "src/subscription/subscription.service";
import { SavedPostsService } from "src/saved-posts/saved-posts.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly subscriptionService: SubscriptionService,
    private readonly savedPostsService: SavedPostsService,
  ) {}

  @Post("register")
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get("get-full/:username")
  async getFullUserData(@Param("username") username: string, @Request() req) {
    const currnet_user_id = req.user.user_id;

    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isOwner = currnet_user_id === user.user_id;

    let subscription;

    if (currnet_user_id) {
      subscription = await this.subscriptionService.findOneSubscription(
        currnet_user_id,
        user.user_id,
      );
    }

    const isSubscribed = subscription?.status === "accepted";
    const isPending = subscription?.status === "pending";

    const canViewPosts = !user.isPrivate || isOwner || isSubscribed;

    const posts = canViewPosts
      ? await this.postService.findUserPostsById(user.user_id)
      : [];

    const savedPosts = isOwner
      ? await this.savedPostsService.getAllSavedPostsByUser(currnet_user_id)
      : [];

    const showSubsInfo = !user.isPrivate || isOwner || isSubscribed;

    const { subscriptions, subscribers } = showSubsInfo
      ? await this.subscriptionService.findAllById(user.user_id)
      : {
          subscriptions: [],
          subscribers: [],
        };

    const data = {
      user,
      posts,
      savedPosts,
      subscriptions,
      subscribers,
      isPrivate: user.isPrivate,
      isSubscribed,
      isPending,
    };

    return data;
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
    @Request() req,
  ) {
    const id = req.user.user_id;

    console.log(`User id: [${id}] trying to update data`);

    return this.userService.updateUser(id, updateUserDto, file);
  }

  @UseGuards(AuthGuard)
  @Get("statistics")
  async getUserStatistics(@Request() req, @Query("period") period: EPeriods) {
    const user_id = req.user.user_id;

    console.log(
      `User with id: [${user_id}] trying to get his statistics by [${period}]`,
    );

    return this.userService.getStatistics(user_id, period);
  }

  @UseGuards(AuthGuard)
  @Patch("privacy")
  async updatePrivacy(@Request() req) {
    const user_id = req.user.user_id;

    return await this.userService.togglePrivacy(user_id);
  }

  @UseGuards(AuthGuard)
  @Get("privacy")
  async getUserPrivacy(@Request() req) {
    const user_id = req.user.user_id;

    return await this.userService.getUserPrivacy(user_id);
  }
}

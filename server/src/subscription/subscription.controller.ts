import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Query,
  Delete,
  Patch,
} from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Request() req) {
    const id: number = req.user.user_id;

    return this.subscriptionService.create(createSubscriptionDto, id);
  }

  @UseGuards(AuthGuard)
  @Get("pending")
  async getAllSubsWithStatusPending(@Request() req) {
    const user_id = req.user.user_id;

    const pendingSubs =
      await this.subscriptionService.getAllPendingSubs(user_id);

    return pendingSubs;
  }

  @UseGuards(AuthGuard)
  @Patch("update-status/:id")
  async updateSubscriptionStatus(@Param("id") id: number, @Request() req) {
    const user_id = req.user.user_id;
    const subscription_id = id;

    await this.subscriptionService.updateStatus(user_id, subscription_id);
  }

  @UseGuards(AuthGuard)
  @Delete("delete-sub/:id")
  async deleteSub(@Param("id") id: number, @Request() req) {
    const user_id = req.user.user_id;
    const subscription_id = id;

    await this.subscriptionService.deleteSub(user_id, subscription_id);
  }

  @Get(":id")
  async findAllById(@Param("id") id: number) {
    const { subscriptions, subscribers } =
      await this.subscriptionService.findAllById(id);

    return { subscriptions, subscribers };
  }

  @Get("is-subscribed/:id")
  async checkIsAlreadySubscribed(
    @Param("id") current_user_id: number,
    @Query("viewed_user_id") viewed_user_id: number,
  ) {
    console.log(
      "Current user: ",
      current_user_id,
      " viewed user: ",
      viewed_user_id,
    );

    const isSub = await this.subscriptionService.checkIsAlreadySubscribed(
      current_user_id,
      viewed_user_id,
    );

    console.log(isSub);

    return isSub;
  }

  @UseGuards(AuthGuard)
  @Delete("delete/:id")
  async deleteSubscription(
    @Param("id") viewed_user_id: number,
    @Request() req,
  ) {
    const id = req.user.user_id;

    console.log("current user: ", id);
    console.log("viewed user: ", viewed_user_id);

    return await this.subscriptionService.deleteSubscription(
      id,
      viewed_user_id,
    );
  }
}

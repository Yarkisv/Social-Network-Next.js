import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
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

  @Get(":id")
  async findAllById(@Param("id") id: number) {
    console.log(id);

    const { subscriptions, subscribers } =
      await this.subscriptionService.findAllById(id);

    return { subscriptions, subscribers };
  }

  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updateSubscriptionDto: UpdateSubscriptionDto
  // ) {
  //   return this.subscriptionService.update(+id, updateSubscriptionDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.subscriptionService.remove(+id);
  // }
}

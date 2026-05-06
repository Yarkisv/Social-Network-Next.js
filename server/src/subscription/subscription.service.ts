import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "./entities/subscription.entity";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, id: number) {
    const subscriber_id = id;
    const targetUserId = createSubscriptionDto.subscribeToId;

    if (subscriber_id === targetUserId) {
      throw new BadRequestException("You cannot subscribe to yourself");
    }

    const existing = await this.subscriptionRepository.findOne({
      where: {
        subscriber: { user_id: subscriber_id },
        subscribedTo: { user_id: targetUserId },
      },
    });

    if (existing) {
      throw new BadRequestException("Subscription already exists");
    }

    const targetUser = await this.userService.findFullDataById(targetUserId);

    if (!targetUser) {
      throw new NotFoundException("User not found");
    }

    const status = targetUser.isPrivate ? "pending" : "accepted";

    const subscription = await this.subscriptionRepository.save({
      subscriber: { user_id: subscriber_id },
      subscribedTo: { user_id: targetUserId },
      subscriptionSince: new Date(),
      status,
    });

    return {
      subscription,
      message:
        status === "pending"
          ? "Follow request sent"
          : "Subscribed successfully",
    };
  }

  async getAllPendingSubs(user_id: number) {
    const subsWithStatusPending = await this.subscriptionRepository.find({
      where: { status: "pending", subscribedTo: { user_id: user_id } },
      relations: ["subscriber", "subscribedTo"],
    });

    const modifiedSubsWithStatusPending = subsWithStatusPending.map((sub) => {
      const {
        subscriber,
        subscribedTo,
        isSubscriptionMutual,
        subscriptionSince,
        ...rest
      } = sub;

      return {
        ...rest,
        subscriber_id: subscriber.user_id,
        fullname: subscriber.fullname,
        username: subscriber.username,
        avatarPathTo: subscriber.avatarPathTo,
      };
    });

    console.log(modifiedSubsWithStatusPending);

    return modifiedSubsWithStatusPending;
  }

  async updateStatus(user_id: number, subscription_id: number) {
    const sub = await this.subscriptionRepository.findOne({
      where: {
        subscription_id: subscription_id,
        subscribedTo: { user_id: user_id },
      },
    });

    if (!sub) {
      throw new NotFoundException("Subscription not found");
    }

    sub.status = "accepted";

    return await this.subscriptionRepository.save(sub);
  }

  async deleteSub(user_id: number, subscription_id: number) {
    const sub = await this.subscriptionRepository.findOne({
      where: {
        subscription_id: subscription_id,
        subscribedTo: { user_id: user_id },
      },
    });

    if (!sub) {
      throw new NotFoundException("Subscription not found");
    }

    return await this.subscriptionRepository.remove(sub);
  }

  async findAllById(user_id: number) {
    const userSubscriptions = await this.subscriptionRepository.find({
      where: { subscriber: { user_id: user_id } },
      relations: ["subscribedTo", "subscriber"],
    });

    const userSubscribers = await this.subscriptionRepository.find({
      where: { subscribedTo: { user_id: user_id } },
      relations: ["subscriber"],
    });

    const subscriptions = await Promise.all(
      userSubscriptions.map(async (sub) => {
        const { user_id, username, fullname, avatarPathTo } = sub.subscribedTo;
        return { user_id, username, fullname, avatarPathTo };
      }),
    );

    const subscribers = await Promise.all(
      userSubscribers.map(async (sub) => {
        const { user_id, username, fullname, avatarPathTo } = sub.subscriber;
        const subscriptionSince = sub.subscriptionSince;
        return { user_id, username, fullname, avatarPathTo, subscriptionSince };
      }),
    );

    return { subscriptions, subscribers };
  }

  // async checkIsAlreadySubscribed(
  //   current_user_id: number,
  //   viewed_user_id: number,
  // ) {
  //   let isSubscribed: boolean = false;

  //   const { subscribers } = await this.findAllById(viewed_user_id);

  //   for (let i = 0; i < subscribers.length; i++) {
  //     if (Number(subscribers[i].user_id) === Number(current_user_id)) {
  //       isSubscribed = true;
  //     }
  //   }

  //   return isSubscribed;
  // }

  async checkIsAlreadySubscribed(
    current_user_id: number,
    viewed_user_id: number,
  ) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        subscriber: { user_id: current_user_id },
        subscribedTo: { user_id: viewed_user_id },
        status: "accepted",
      },
    });

    return !!subscription;
  }

  async findOneSubscription(subscriber_id: number, target_id) {
    return await this.subscriptionRepository.findOne({
      where: {
        subscriber: { user_id: subscriber_id },
        subscribedTo: { user_id: target_id },
      },
    });
  }

  async deleteSubscription(current_user_id: number, viewed_user_id: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        subscriber: { user_id: current_user_id },
        subscribedTo: { user_id: viewed_user_id },
      },
      relations: ["subscriber", "subscribedTo"],
    });

    if (subscription) {
      await this.subscriptionRepository.remove(subscription);
    }
  }
}

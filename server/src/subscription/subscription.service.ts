import { Injectable } from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "./entities/subscription.entity";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { FileService } from "src/services/file.service";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly fileService: FileService
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, id: number) {
    const subscriber_id = id;

    console.log(subscriber_id);

    const date = new Date(createSubscriptionDto.currentDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const changedDate = `${year}-${month}-${day}`;

    console.log(changedDate);
    console.log(createSubscriptionDto.subscribeToId);

    const subscription = await this.subscriptionRepository.save({
      subscriber: { user_id: subscriber_id },
      subscribedTo: { user_id: createSubscriptionDto.subscribeToId },
      subscriptionSince: createSubscriptionDto.currentDate,
    });

    return { subscription };
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
        const { user_id, username, fullname } = sub.subscribedTo;
        const imageBase64 = await this.fileService.getFile(
          sub.subscriber.avatarPathTo
        );
        return { user_id, username, fullname, imageBase64 };
      })
    );

    const subscribers = await Promise.all(
      userSubscribers.map(async (sub) => {
        const { user_id, username, fullname } = sub.subscriber;
        const imageBase64 = await this.fileService.getFile(
          sub.subscriber.avatarPathTo
        );
        return { user_id, username, fullname, imageBase64 };
      })
    );

    console.log(
      "User subscriptions: \n",
      subscriptions,
      "\nUser subscribers: \n",
      subscribers
    );

    return { subscriptions, subscribers };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} subscription`;
  // }

  // update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
  //   return `This action updates a #${id} subscription`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} subscription`;
  // }
}

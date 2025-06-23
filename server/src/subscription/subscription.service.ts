import { Injectable } from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "./entities/subscription.entity";
import { Repository } from "typeorm";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>
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

  // findAll() {
  //   return `This action returns all subscription`;
  // }

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

import { User } from "src/user/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  subscription_id: number;

  //Подписчики - много к одному
  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: "subscribed_to_id" })
  subscribedTo: User;

  //Подписки - много к одному
  @ManyToOne(() => User, (user) => user.subscribers)
  @JoinColumn({ name: "subscriber_id" })
  subscriber: User;

  @Column({ default: false })
  isSubscriptionMutual: boolean;

  @Column()
  subscriptionSince: Date;
}

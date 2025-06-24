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

  //Подписчик - пользователь который подписан на другого пользователя - много к одному
  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: "subscriber_id" })
  subscriber: User;

  //Пользователь на которого подписался другой пользователь - много к одному
  @ManyToOne(() => User, (user) => user.subscribers)
  @JoinColumn({ name: "subscribed_to_id" })
  subscribedTo: User;

  @Column({ default: false })
  isSubscriptionMutual: boolean;

  @Column()
  subscriptionSince: Date;
}

import { IsNotEmpty } from "class-validator";
import { ChatMember } from "src/chat-members/entities/chat-member.entity";
import { Message } from "src/messages/entities/message.entity";
import { Post } from "src/post/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "src/comment/entities/comment.entity";
import { Subscription } from "src/subscription/entities/subscription.entity";
import { Like } from "src/like/entities/like.entity";

@Entity("Users")
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  fullname: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @IsNotEmpty()
  @Column({ length: 255 })
  password: string;

  // Подписки - массив пользователей на которых подписан пользователь
  @OneToMany(() => Subscription, (subscription) => subscription.subscriber)
  subscriptions: Subscription[];

  // Подписчики - массив пользователей которые подписаны на пользователя
  @OneToMany(() => Subscription, (subscription) => subscription.subscribedTo)
  subscribers: Subscription[];

  @Column({ default: "" })
  description: string;

  @Column({ default: "/default-avatar.jpg" })
  avatarPathTo: string;

  @OneToMany(() => ChatMember, (member) => member.user)
  chatMemberships: ChatMember[];

  @OneToMany(() => Message, (message) => message.user)
  sentMessages: Message[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  Likes: Like[];
}

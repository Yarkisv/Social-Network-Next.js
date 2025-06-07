import { IsNotEmpty } from "class-validator";
import { ChatMember } from "src/chat-members/entities/chat-member.entity";
import { Message } from "src/messages/entities/message.entity";
import { Post } from "src/post/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ default: 0 })
  subscribers: number;

  @Column({ default: 0 })
  subscriptions: number;

  @Column({ default: "" })
  description: string;

  @OneToMany(() => ChatMember, (member) => member.user)
  chatMemberships: ChatMember[];

  @OneToMany(() => Message, (message) => message.user)
  sentMessages: Message[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}

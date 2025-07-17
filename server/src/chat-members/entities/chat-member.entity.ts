import { Chat } from "src/chat/entities/chat.entity";
import { User } from "src/user/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Chat_members")
export class ChatMember {
  @PrimaryGeneratedColumn()
  chat_member_id: number;

  @Column()
  chat_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => Chat, (chat) => chat.members, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "chat_id" })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.chatMemberships, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}

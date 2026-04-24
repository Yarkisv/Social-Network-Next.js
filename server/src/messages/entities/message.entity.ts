import { Chat } from "src/chat/entities/chat.entity";
import { User } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  message_id!: number;

  @Column()
  content!: string;

  @CreateDateColumn()
  sent_at!: Date;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: "sender_id" })
  user!: User;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "chat_id" })
  chat!: Chat;
}

import { ChatMember } from "src/chat-members/entities/chat-member.entity";
import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("chats")
export class Chat {
  @PrimaryGeneratedColumn()
  chat_id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ChatMember, (member) => member.chat)
  members!: ChatMember[];
}

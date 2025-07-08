import { ChatMember } from "src/chat-members/entities/chat-member.entity";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Chats")
export class Chat {
  @PrimaryGeneratedColumn()
  chat_id: number;

  @Column()
  createdAt: Date;

  @OneToMany(() => ChatMember, (member) => member.chat)
  members: ChatMember[];
}
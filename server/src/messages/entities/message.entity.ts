import { User } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Messages")
export class Message {
  @PrimaryGeneratedColumn()
  message_id: number;

  @Column()
  chat_id: number;

  @Column()
  sender_id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  sent_at: Date;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: "sender_id" })
  user: User;
}

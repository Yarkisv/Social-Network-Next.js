import { ChatMember } from "src/chat-members/entities/chat-member.entity";
import { Message } from "src/messages/entities/message.entity";
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

  @Column()
  password: string;

  @OneToMany(() => ChatMember, (member) => member.user)
  chatMemberships: ChatMember[];

  @OneToMany(() => Message, (message) => message.user)
  sentMessages: Message[]
}

import { Module } from "@nestjs/common";
import { ChatMembersService } from "./chat-members.service";
import { ChatMembersController } from "./chat-members.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatMember } from "./entities/chat-member.entity";
import { UserModule } from "src/user/user.module";
import { MessagesModule } from "src/messages/messages.module";

@Module({
  imports: [TypeOrmModule.forFeature([ChatMember]), UserModule, MessagesModule],
  controllers: [ChatMembersController],
  providers: [ChatMembersService],
  exports: [ChatMembersService],
})
export class ChatMembersModule {}

import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "./entities/chat.entity";
import { AuthModule } from "src/auth/auth.module";
import { ChatMembersModule } from "src/chat-members/chat-members.module";

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [TypeOrmModule.forFeature([Chat]), AuthModule, ChatMembersModule],
})
export class ChatModule {}

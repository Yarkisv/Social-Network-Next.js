import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "./entities/chat.entity";
import { AuthModule } from "src/auth/auth.module";
import { ChatMembersModule } from "src/chat-members/chat-members.module";
import { ChatGateway } from "./chat.gateway";
import { MessagesModule } from "src/messages/messages.module";

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [
    TypeOrmModule.forFeature([Chat]),
    AuthModule,
    ChatMembersModule,
    MessagesModule,
  ],
})
export class ChatModule {}

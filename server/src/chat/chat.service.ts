import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "./entities/chat.entity";
import { Repository } from "typeorm";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatMembersService } from "src/chat-members/chat-members.service";
import { CreateChatMemberDto } from "src/chat-members/dto/create-chat-member.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    private readonly chatMembersService: ChatMembersService
  ) {}

  async createChat(current_user_id: number, createChatDto: CreateChatDto) {
    const date = createChatDto.created_at;
    const user_id = createChatDto.user_id;

    console.log(date);

    const chat = await this.chatRepository.save({
      createdAt: date,
    });

    const chatMembersDto: CreateChatMemberDto = {
      chat_id: chat.chat_id,
      users_id: [current_user_id, Number(user_id)],
    };

    console.log(chatMembersDto);

    await this.chatMembersService.create(chatMembersDto);

    return { chat };
  }
}

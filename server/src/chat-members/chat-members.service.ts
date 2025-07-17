import { Injectable } from "@nestjs/common";
import { CreateChatMemberDto } from "./dto/create-chat-member.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMember } from "./entities/chat-member.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatMembersService {
  constructor(
    @InjectRepository(ChatMember)
    private readonly chatMembersRepository: Repository<ChatMember>
  ) {}

  async create(createChatMemberDto: CreateChatMemberDto) {
    const { chat_id, users_id } = createChatMemberDto;

    console.log("Chat id from members: ", chat_id, ", Users id: ", users_id);

    const chatMembers = users_id.map((user_id) => ({
      chat_id,
      user_id,
    }));

    console.log(chatMembers);

    await this.chatMembersRepository.save(chatMembers);
  }

  async findAllChatsByUserId(user_id: number) {
    const chats = await this.chatMembersRepository.find({
      where: {
        user: { user_id: user_id },
      },
      relations: ["chat"],
    });

    console.log(chats);
  }
}

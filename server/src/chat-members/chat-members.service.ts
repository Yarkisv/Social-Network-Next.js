import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateChatMemberDto } from "./dto/create-chat-member.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMember } from "./entities/chat-member.entity";
import { In, Repository } from "typeorm";
import { UserService } from "src/user/user.service";

@Injectable()
export class ChatMembersService {
  constructor(
    @InjectRepository(ChatMember)
    private readonly chatMembersRepository: Repository<ChatMember>,
    private readonly userService: UserService,
  ) {}

  async create(createChatMemberDto: CreateChatMemberDto) {
    const { chat_id, users_id } = createChatMemberDto;

    const chatMembers = users_id.map((user_id) => ({
      chat: { chat_id },
      user: { user_id },
    }));

    await this.chatMembersRepository.save(chatMembers);
  }

  async findAllChatsByUserId(user_id: number) {
    const chatMemberships = await this.chatMembersRepository.find({
      where: {
        user: { user_id: user_id },
      },
      relations: ["chat"],
    });

    const chats = chatMemberships.map((membership) => membership.chat);
    const chatIds = chats.map((chat) => chat.chat_id);

    const chatMembers = await this.chatMembersRepository.find({
      where: { chat: { chat_id: In(chatIds) } },
      relations: ["user", "chat"],
    });

    const modifiedChats = await Promise.all(
      chats.map(async (chat) => {
        const member = chatMembers.find(
          (chatMember) =>
            chatMember.chat.chat_id === chat.chat_id &&
            chatMember.user.user_id !== user_id,
        );

        if (!member) return null;

        const user = await this.userService.findFullDataById(
          member?.user.user_id,
        );

        return {
          ...chat,
          user_id: user.user_id,
          username: user.username,
          chatName: user.fullname,
          avatarPathTo: user.avatarPathTo,
        };
      }),
    );

    console.log(modifiedChats);

    return modifiedChats;
  }

  async isPrivateChatBetweenTwoUsersExists(user1_id: number, user2_id: number) {
    const user1Chats = await this.chatMembersRepository.find({
      where: { user: { user_id: user1_id } },
      relations: ["chat"],
    });

    const user2Chats = await this.chatMembersRepository.find({
      where: { user: { user_id: user2_id } },
      relations: ["chat"],
    });

    let isChatExists: boolean = false;

    for (let i = 0; i < user1Chats.length; i++) {
      for (let j = 0; j < user2Chats.length; j++) {
        if (user1Chats[i].chat.chat_id === user2Chats[j].chat.chat_id) {
          isChatExists = true;
          return true;
        }
      }
    }

    return false;
  }

  async findChatByUserId(user_id: number, chat_id: number) {
    const chatMemberships = await this.chatMembersRepository.find({
      where: {
        chat: { chat_id: chat_id },
      },
      relations: ["chat", "user"],
    });

    // Проверка что id пользователя из токена есть в участниках чата
    const isUserCanReadChat = chatMemberships.some(
      (chatMember) => chatMember.user.user_id === user_id,
    );

    if (!isUserCanReadChat) {
      console.log(`Is user can read chat: ${isUserCanReadChat}`);

      throw new NotFoundException();
    }

    if (!chatMemberships) {
      throw new NotFoundException();
    }

    const chat = chatMemberships[0].chat;

    const chatMembers = await this.chatMembersRepository.find({
      where: {
        chat: { chat_id: chat_id },
      },
      relations: ["chat", "user"],
    });

    const notCurrentMember = chatMembers.find(
      (chatMember) => chatMember.user.user_id !== user_id,
    );

    if (!notCurrentMember) return null;

    const notCurrentUser = await this.userService.findFullDataById(
      notCurrentMember?.user.user_id,
    );

    return {
      ...chat,
      user_id: notCurrentUser.user_id,
      username: notCurrentUser.username,
      chatName: notCurrentUser.fullname,
      avatarPathTo: notCurrentUser.avatarPathTo,
    };
  }
}

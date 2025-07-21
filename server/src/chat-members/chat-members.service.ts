import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateChatMemberDto } from "./dto/create-chat-member.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMember } from "./entities/chat-member.entity";
import { In, Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { NotFoundError } from "rxjs";

@Injectable()
export class ChatMembersService {
  constructor(
    @InjectRepository(ChatMember)
    private readonly chatMembersRepository: Repository<ChatMember>,
    private readonly userService: UserService
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
    const chatMemberships = await this.chatMembersRepository.find({
      where: {
        user: { user_id: user_id },
      },
      relations: ["chat"],
    });

    const chats = chatMemberships.map((membership) => membership.chat);
    const chatIds = chats.map((chat) => chat.chat_id);

    const chatMembers = await this.chatMembersRepository.find({
      where: { chat_id: In(chatIds) },
    });

    const modifiedChatMembers = chatMembers.map(
      (chatMember) => chatMember.user_id
    );

    const notCurrentUsersId = modifiedChatMembers.filter(
      (member) => member !== user_id
    );

    // console.log(
    //   "User with id: ",
    //   user_id,
    //   " has chat with user with id: ",
    //   notCurrentUsersId
    // );

    const modifiedChats = await Promise.all(
      chats.map(async (chat) => {
        const member = chatMembers.find(
          (chatMember) =>
            chatMember.chat_id === chat.chat_id &&
            chatMember.user_id !== user_id
        );

        if (!member) return null;

        const user = await this.userService.findById(member?.user_id);

        return {
          ...chat,
          user_id: user.user_id,
          username: user.username,
          chatName: user.fullname,
          avatarBase64: user.avatarBase64,
        };
      })
    );

    // console.log(modifiedChats);

    return modifiedChats;
  }

  async isPrivateChatBetweenTwoUsersExists(user1_id: number, user2_id: number) {
    const user1Chats = await this.chatMembersRepository.find({
      where: { user: { user_id: user1_id } },
    });

    const user2Chats = await this.chatMembersRepository.find({
      where: { user: { user_id: user2_id } },
    });

    console.log("Chats user 1: ", user1Chats, "\nChats user 2: ", user2Chats);

    let isChatExists: boolean = false;

    for (let i = 0; i < user1Chats.length; i++) {
      for (let j = 0; j < user2Chats.length; j++) {
        if (user1Chats[i].chat_id === user2Chats[j].chat_id) {
          isChatExists = true;
          return true;
        }
      }
    }

    console.log(isChatExists);

    return false;
  }

  async findChatByUserId(user_id: number, chat_id: number) {
    const chatMembership = await this.chatMembersRepository.findOne({
      where: {
        chat: { chat_id: chat_id },
      },
      relations: ["chat"],
    });

    if (!chatMembership) {
      throw new NotFoundException();
    }

    const chat = chatMembership?.chat;

    // console.log(chat);

    const chatMembers = await this.chatMembersRepository.find({
      where: {
        chat: { chat_id: chat_id },
      },
    });

    // console.log(chatMembers);

    const notCurrentMember = chatMembers.find(
      (chatMember) => chatMember.user_id !== user_id
    );

    if (!notCurrentMember) return null;

    const notCurrentUser = await this.userService.findById(
      notCurrentMember?.user_id
    );

    return {
      ...chat,
      user_id: notCurrentUser.user_id,
      username: notCurrentUser.username,
      chatName: notCurrentUser.fullname,
      avatarBase64: notCurrentUser.avatarBase64,
    };
  }
}

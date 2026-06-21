import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateChatMemberDto } from "./dto/create-chat-member.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMember } from "./entities/chat-member.entity";
import { In, Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { MessagesService } from "src/messages/messages.service";
import { ChatService } from "../chat/chat.service";

@Injectable()
export class ChatMembersService {
  constructor(
    @InjectRepository(ChatMember)
    private readonly chatMembersRepository: Repository<ChatMember>,
    private readonly userService: UserService,
    private readonly messageService: MessagesService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  async create(createChatMemberDto: CreateChatMemberDto) {
    const { chat_id, users_id } = createChatMemberDto;

    const chatMembers = users_id.map((user_id) => ({
      chat: { chat_id },
      user: { user_id },
    }));

    await this.chatMembersRepository.save(chatMembers);
  }

  // async findAllChatsByUserId(user_id: number) {
  //   const chatMemberships = await this.chatMembersRepository.find({
  //     where: {
  //       user: { user_id },
  //     },
  //     relations: ["chat"],
  //   });

  //   const chats = chatMemberships.map((m) => m.chat);
  //   const chatIds = chats.map((c) => c.chat_id);

  //   const chatMembers = await this.chatMembersRepository.find({
  //     where: { chat: { chat_id: In(chatIds) } },
  //     relations: ["user", "chat"],
  //   });

  //   const modifiedChats = await Promise.all(
  //     chats.map(async (chat) => {
  //       const member = chatMembers.find(
  //         (cm) =>
  //           cm.chat.chat_id === chat.chat_id && cm.user.user_id !== user_id,
  //       );

  //       if (!member) return null;

  //       const user = await this.userService.findFullDataById(
  //         member.user.user_id,
  //       );

  //       const myMembership = chatMembers.find(
  //         (cm) =>
  //           cm.chat.chat_id === chat.chat_id && cm.user.user_id === user_id,
  //       );

  //       const lastReadId = myMembership?.last_read_message_id ?? 0;

  //       const messages = await this.messageService.findAllByChatId(
  //         chat.chat_id,
  //       );

  //       const unreadCount = messages.filter(
  //         (m) => m.message_id > lastReadId,
  //       ).length;

  //       const lastMessage = messages[messages.length - 1];

  //       const lastMessageContent =
  //         lastMessage.type === "text"
  //           ? (lastMessage.content = lastMessage.content)
  //           : lastMessage.type === "file"
  //             ? (lastMessage.content = "file")
  //             : lastMessage.type === "image"
  //               ? (lastMessage.content = "image")
  //               : (lastMessage.content = "video");

  //       return {
  //         ...chat,
  //         user_id: user.user_id,
  //         username: user.username,
  //         chatName: user.fullname,
  //         avatarPathTo: user.avatarPathTo,
  //         unreadCount,
  //         lastMessage: {
  //           content: lastMessageContent,
  //           sent_at: lastMessage.time,
  //         },
  //       };
  //     }),
  //   );

  //   return modifiedChats.filter(Boolean);
  // }

  async findAllChatsByUserId(user_id: number) {
    const chatMemberships = await this.chatMembersRepository.find({
      where: {
        user: { user_id },
      },
      relations: ["chat"],
    });

    const chats = chatMemberships.map((m) => m.chat);
    const chatIds = chats.map((c) => c.chat_id);

    const chatMembers = await this.chatMembersRepository.find({
      where: { chat: { chat_id: In(chatIds) } },
      relations: ["user", "chat"],
    });

    const modifiedChats = await Promise.all(
      chats.map(async (chat) => {
        const member = chatMembers.find(
          (cm) =>
            cm.chat.chat_id === chat.chat_id && cm.user.user_id !== user_id,
        );

        if (!member) return null;

        const user = await this.userService.findFullDataById(
          member.user.user_id,
        );

        const myMembership = chatMembers.find(
          (cm) =>
            cm.chat.chat_id === chat.chat_id && cm.user.user_id === user_id,
        );

        const lastReadId = myMembership?.last_read_message_id ?? 0;

        const messages = await this.messageService.findAllByChatId(
          chat.chat_id,
        );

        const unreadCount = messages.filter(
          (m) => m.message_id > lastReadId,
        ).length;

        // Check if there are any messages
        if (messages.length === 0) {
          return {
            ...chat,
            user_id: user.user_id,
            username: user.username,
            chatName: user.fullname,
            avatarPathTo: user.avatarPathTo,
            unreadCount: 0,
            lastMessage: null, // or undefined, or a default value
          };
        }

        const lastMessage = messages[messages.length - 1];

        let lastMessageContent;
        if (lastMessage.type === "text") {
          lastMessageContent = lastMessage.content;
        } else if (lastMessage.type === "file") {
          lastMessageContent = "file";
        } else if (lastMessage.type === "image") {
          lastMessageContent = "image";
        } else if (lastMessage.type === "video") {
          lastMessageContent = "video";
        } else {
          lastMessageContent = "unknown";
        }

        return {
          ...chat,
          user_id: user.user_id,
          username: user.username,
          chatName: user.fullname,
          avatarPathTo: user.avatarPathTo,
          unreadCount,
          lastMessage: {
            content: lastMessageContent,
            sent_at: lastMessage.time,
          },
        };
      }),
    );

    return modifiedChats.filter(Boolean);
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

  async markAsRead(chatId: number, userId: number, lastMessageId: number) {
    console.log("marking as reed", chatId, userId, lastMessageId);

    await this.chatMembersRepository.update(
      {
        chat: { chat_id: chatId },
        user: { user_id: userId },
      },
      {
        last_read_message_id: lastMessageId,
      },
    );
  }

  async getUnreadMessages(chat_id: number, user_id: number) {
    const membership = await this.chatMembersRepository.findOne({
      where: {
        chat: { chat_id: chat_id },
        user: { user_id: user_id },
      },
    });

    const lastReadId = membership?.last_read_message_id ?? 0;

    const messages = await this.messageService.findAllByChatId(chat_id);

    return messages.filter((m) => m.message_id > lastReadId);
  }

  async deleteChat(user_id: number, chat_id: number) {
    const chat = await this.chatService.findOneChat(chat_id);

    if (!chat) {
      throw new NotFoundException("Чат не найден");
    }

    const chatMember = await this.chatMembersRepository.findOne({
      where: {
        chat: { chat_id: chat_id },
        user: { user_id: user_id },
      },
    });

    if (!chatMember) {
      throw new ForbiddenException("Вы не являетесь участником этого чата");
    }

    await this.chatMembersRepository.delete({
      chat: { chat_id: chat_id },
    });

    await this.messageService.deleteAllChatMessages(chat_id);

    await this.chatService.deleteChat(chat_id);

    return {
      success: true,
      message: "Чат успешно удален для обоих участников",
    };
  }
}

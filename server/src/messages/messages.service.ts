import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { time } from "console";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto, sender_id: number) {
    const message = await this.messageRepository.save({
      chat: { chat_id: createMessageDto.chat_id },
      user: { user_id: sender_id },
      content: createMessageDto.content,
      sent_at: new Date(),
    });

    return {
      message_id: message.message_id,
      content: message.content,
      user_id: message.user.user_id,
      chat_id: message.chat.chat_id,
      time: message.sent_at,
    };
  }

  async findAllByChatId(chat_id: number) {
    const messages = await this.messageRepository.find({
      where: {
        chat: { chat_id: chat_id },
      },
      relations: ["user", "chat"],
    });

    console.log(messages);

    const modifiedMessages = messages.map((message) => {
      const { chat, user, sent_at, ...rest } = message;

      const user_id = user.user_id;
      const chat_id = chat.chat_id;

      return { ...rest, user_id, chat_id, time: sent_at.toISOString() };
    });

    console.log(modifiedMessages);

    return modifiedMessages;
  }
}

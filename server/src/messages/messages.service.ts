import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.messageRepository.save({
      chat_id: createMessageDto.chat_id,
      sender_id: createMessageDto.sender_id,
      content: createMessageDto.content,
      sent_at: createMessageDto.sent_at,
    });

    return message;
  }

  async findAllByChatId(chat_id: number) {
    const messages = await this.messageRepository.find({
      where: {
        chat_id: chat_id,
      },
    });

    console.log(messages);

    return messages;
  }
}

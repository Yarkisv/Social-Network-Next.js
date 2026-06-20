import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { DeleteMessageDto } from "./dto/delete-message.dto";
import { FileService } from "../services/file.service";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly fileService: FileService,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    sender_id: number,
    media_path?: string,
    type: "text" | "image" | "video" | "file" = "text",
  ) {
    const messageEntity = this.messageRepository.create({
      chat: { chat_id: createMessageDto.chat_id },
      user: { user_id: sender_id },
      content: createMessageDto.content || null,
      media_path: media_path || null,
      type,
      sent_at: new Date(),
    } as DeepPartial<Message>);

    const message = await this.messageRepository.save(messageEntity);

    return {
      message_id: message.message_id,
      content: message.content,
      media_path: message.media_path,
      type: message.type,
      user_id: message.user.user_id,
      chat_id: message.chat.chat_id,
      time: message.sent_at,
    };
  }

  async createWithFile(
    createMessageDto: CreateMessageDto,
    file: Express.Multer.File,
    sender_id: number,
  ) {
    const folder = `media/chats/${createMessageDto.chat_id}`;

    const media_path = await this.fileService.uploadFile(file, folder);

    let type: "image" | "video" | "file" = "file";

    if (file.mimetype.startsWith("image")) type = "image";
    else if (file.mimetype.startsWith("video")) type = "video";

    const message = await this.create(
      createMessageDto,
      sender_id,
      media_path,
      type,
    );

    return message;
  }

  async findAllByChatId(chat_id: number) {
    const messages = await this.messageRepository.find({
      where: {
        chat: { chat_id: chat_id },
      },
      relations: ["user", "chat"],
    });

    const modifiedMessages = messages.map((message) => {
      const { chat, user, sent_at, ...rest } = message;

      const user_id = user.user_id;
      const chat_id = chat.chat_id;

      return { ...rest, user_id, chat_id, time: sent_at.toISOString() };
    });

    console.log(modifiedMessages);

    return modifiedMessages;
  }

  async deleteMessage(deleteMessageDto: DeleteMessageDto, user_id: number) {
    const { chat_id, message_id } = deleteMessageDto;

    const message = await this.messageRepository.findOne({
      where: {
        chat: { chat_id: chat_id },
        user: { user_id: user_id },
        message_id: message_id,
      },
    });

    if (!message) {
      throw new NotFoundException("Message not found");
    }

    const removedMessageId = message.message_id;

    await this.messageRepository.remove(message);

    return removedMessageId;
  }

  async editMessage(updateMessageDto: UpdateMessageDto, user_id: number) {
    const { chat_id, message_id, new_content } = updateMessageDto;

    const result = await this.messageRepository.update(
      {
        message_id,
        user: { user_id },
        chat: { chat_id },
      },
      {
        content: new_content,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException("Message not found");
    }

    return { message_id, new_content };
  }

  async deleteAllChatMessages(chat_id: number) {
    await this.messageRepository.delete({
      chat: { chat_id: chat_id },
    });
  }
}

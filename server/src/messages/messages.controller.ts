import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get("get/:id")
  async fetchAllMessagesByChatId(@Param("id") id: number) {
    return await this.messagesService.findAllByChatId(id);
  }
}

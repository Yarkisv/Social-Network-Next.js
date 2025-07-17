import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { CreateChatDto } from "./dto/create-chat.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post("new")
  async createChat(@Request() req, @Body() createChatDto: CreateChatDto) {
    const id: number = req.user.user_id;

    console.log(createChatDto);

    return this.chatService.createChat(id, createChatDto);
  }
}

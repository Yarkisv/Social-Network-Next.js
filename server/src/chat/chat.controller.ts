import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatMembersService } from "src/chat-members/chat-members.service";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatMembersService: ChatMembersService
  ) {}

  @UseGuards(AuthGuard)
  @Post("new")
  async createChat(@Request() req, @Body() createChatDto: CreateChatDto) {
    const id: number = req.user.user_id;

    const isChatAlreadyExists =
      await this.chatMembersService.isPrivateChatBetweenTwoUsersExists(
        id,
        createChatDto.user_id
      );

    if (!isChatAlreadyExists) {
      return this.chatService.createChat(id, createChatDto);
    }

    console.log(createChatDto);
  }

  @UseGuards(AuthGuard)
  @Get("get/all")
  async getAllChatsByUserId(@Request() req) {
    const user_id: number = req.user.user_id;

    return this.chatMembersService.findAllChatsByUserId(user_id);
  }
}

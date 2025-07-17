import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ChatMembersService } from "./chat-members.service";
import { CreateChatMemberDto } from "./dto/create-chat-member.dto";

@Controller("chat-members")
export class ChatMembersController {
  constructor(private readonly chatMembersService: ChatMembersService) {}

  @Post()
  create(@Body() createChatMemberDto: CreateChatMemberDto) {
    return this.chatMembersService.create(createChatMemberDto);
  }
}

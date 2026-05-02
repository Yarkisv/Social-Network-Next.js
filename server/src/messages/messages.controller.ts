import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Controller("messages")
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post("file")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async saveFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMessageDto: CreateMessageDto,
    @Req() req,
  ) {
    console.log(1);

    const message = await this.messagesService.createWithFile(
      createMessageDto,
      file,
      req.user.user_id,
    );

    console.log(message);

    this.eventEmitter.emit("message.created", message);
  }

  @Get("get/:id")
  async fetchAllMessagesByChatId(@Param("id") id: number) {
    return await this.messagesService.findAllByChatId(id);
  }
}

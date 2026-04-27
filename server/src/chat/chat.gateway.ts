import { Logger, UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server } from "socket.io";
import { WsAuthGuard } from "src/guards/wsAuth.guard";
import { CreateMessageDto } from "src/messages/dto/create-message.dto";
import { DeleteMessageDto } from "src/messages/dto/delete-message.dto";
import { UpdateMessageDto } from "src/messages/dto/update-message.dto";
import { MessagesService } from "src/messages/messages.service";

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly messageService: MessagesService) {}

  @WebSocketServer() io!: Server;

  afterInit() {
    this.logger.log("Initialized");
  }

  handleConnection(client: any) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage("message")
  async handleMessage(client: any, payload: CreateMessageDto) {
    console.log("CREATING SOCKET HANDLER TRIGGERED");
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    const user = client.data.user;

    console.log("Sender id: ", user.user_id);

    const message = await this.messageService.create(payload, user.user_id);

    console.log("new message:", "\n", JSON.stringify(message, null, 2));

    this.io.emit("newMessage", {
      message_id: message.message_id,
      content: message.content,
      user_id: message.user_id,
      chat_id: message.chat_id,
      time: message.time.toISOString(),
    });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage("deleteMessage")
  async handleDeleteMessage(client: any, payload: DeleteMessageDto) {
    console.log("DELETING SOCKET HANDLER TRIGGERED");
    const user_id = client.data.user.user_id;

    this.logger.log(
      `Message deleting reques received from client id: ${client.id}`,
    );
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    const message_id = await this.messageService.deleteMessage(
      payload,
      user_id,
    );

    console.log(`deleted message_id: ${message_id}`);

    this.io.emit("deletedMessage", message_id);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage("editMessage")
  async handleEditMessage(client: any, payload: UpdateMessageDto) {
    console.log("EDITING SOCKET HANDLER TRIGGERED");
    const user_id = client.data.user.user_id;

    this.logger.log(
      `Message editing reques received from client id: ${client.id}`,
    );
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    const { message_id, new_content } = await this.messageService.editMessage(
      payload,
      user_id,
    );

    this.io.emit("editedMessage", {
      message_id,
      new_content,
    });
  }
}

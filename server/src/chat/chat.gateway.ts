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
import { MessagesService } from "src/messages/messages.service";

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly messageService: MessagesService) {}

  @WebSocketServer() io: Server;

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
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    const user = client.data.user;

    console.log("Sender id: ", user.user_id);

    const message = await this.messageService.create(payload, user.user_id);

    this.io.emit("newMessage", message);
  }
}

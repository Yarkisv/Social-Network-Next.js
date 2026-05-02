import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./entities/message.entity";
import { FileService } from "src/services/file.service";
import { AuthModule } from "src/auth/auth.module";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    AuthModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, FileService],
  exports: [MessagesService],
})
export class MessagesModule {}

import { PartialType } from "@nestjs/mapped-types";
import { CreateMessageDto } from "./create-message.dto";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsNotEmpty()
  @IsNumber()
  chat_id!: number;

  @IsNotEmpty()
  @IsNumber()
  message_id!: number;

  @IsNotEmpty()
  @IsString()
  new_content!: string;
}

import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteMessageDto {
  @IsNotEmpty()
  @IsNumber()
  chat_id!: number;

  @IsNotEmpty()
  @IsNumber()
  message_id!: number;
}

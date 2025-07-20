import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  chat_id: number;

  @IsNotEmpty()
  @IsNumber()
  sender_id: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsDate()
  sent_at: Date;
}

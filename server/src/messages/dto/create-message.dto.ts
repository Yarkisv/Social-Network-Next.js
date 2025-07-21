import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  chat_id: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}

import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateChatMemberDto {
  @IsNumber()
  chat_id: number;

  @IsNotEmpty()
  users_id: number[];
}

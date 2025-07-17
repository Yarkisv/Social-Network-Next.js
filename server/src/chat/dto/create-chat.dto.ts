import { IsDate, IsNotEmpty } from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class CreateChatDto {
  @IsNotEmpty()
  user_id: number;

  @IsDate()
  created_at: Date;
}

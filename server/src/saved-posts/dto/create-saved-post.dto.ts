import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSavedPostDto {
  @IsNotEmpty()
  @IsNumber()
  post_id!: number;
}

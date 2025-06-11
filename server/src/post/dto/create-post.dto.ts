import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  contentPathTo: string;

  @Type(() => Number)
  userId: number;
}

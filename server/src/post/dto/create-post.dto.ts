import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  contentPathTo: string;

  @IsString()
  post_title: string;

  @Type(() => Number)
  user_id: number;
}

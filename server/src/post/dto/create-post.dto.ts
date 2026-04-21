import { Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  post_title!: string;

  @IsString()
  hashtag!: string;

  @IsArray()
  contentPathsTo!: string[];

  @Type(() => Number)
  user_id!: number;
}

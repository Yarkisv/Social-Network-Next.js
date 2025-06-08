import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
}

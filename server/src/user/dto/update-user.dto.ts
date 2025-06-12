import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsOptional, isString, IsString } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  fullname?: string | undefined;

  @IsString()
  @IsOptional()
  username: string | undefined;

  @IsString()
  @IsOptional()
  phone?: string | undefined;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string | undefined;

  @IsString()
  @IsOptional()
  description?: string | undefined;
}

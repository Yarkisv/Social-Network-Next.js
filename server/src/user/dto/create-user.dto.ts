import { IsEmail } from "class-validator";

export class CreateUserDto {
  fullname: string;
  username: string;
  @IsEmail()
  email: string;
  phone: string;
  password: string;
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as argon2 from "argon2";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isUserExist) {
      throw new UnauthorizedException("This email already exists");
    }

    const user = await this.userRepository.save({
      fullname: createUserDto.fullname,
      username: createUserDto.username,
      email: createUserDto.email,
      phone: createUserDto.phone,
      password: await argon2.hash(createUserDto.password),
    });

    return { user };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findAll() {
    const users = await this.userRepository.find();

    if (users.length === 0) {
      throw new NotFoundException("Users not found");
    }

    const modifiedUsers = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    return modifiedUsers;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findBy({
      username: username,
    });

    if (user.length === 0) {
      throw new NotFoundException("User not found 404");
    }

    const modifiedUser = user.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    return modifiedUser[0];
  }
}

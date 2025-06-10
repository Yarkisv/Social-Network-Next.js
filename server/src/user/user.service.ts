import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Like, Repository } from "typeorm";
import * as argon2 from "argon2";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileService } from "src/services/file.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly fileServise: FileService
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

  async findUsersBySymbol(string: string) {
    const users = await this.userRepository.find({
      where: {
        username: Like(`${string}%`),
      },
    });

    if (users.length === 0) {
      throw new NotFoundException("Users not found 404");
    }

    const modifiedUsers = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    return modifiedUsers;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
      select: [
        "user_id",
        "fullname",
        "username",
        "email",
        "phone",
        "subscribers",
        "subscriptions",
        "description",
        "avatarPathTo",
        "posts",
      ],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const avatarBase64: string = await this.fileServise.getFile(
      user.avatarPathTo
    );

    const modifiedUser = JSON.parse(JSON.stringify(user));

    modifiedUser.avatarPathTo = avatarBase64;

    return modifiedUser;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File
  ) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (updateUserDto.fullname !== undefined) {
      user.fullname = updateUserDto.fullname;
    }

    if (updateUserDto.username !== undefined) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.phone !== undefined) {
      user.phone = updateUserDto.phone;
    }

    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }

    if (file) {
      user.avatarPathTo = "";
    }

    return this.userRepository.save(user);
  }
}

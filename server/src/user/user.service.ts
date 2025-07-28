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

  async findOriginalById(id: number) {
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
        "description",
        "avatarPathTo",
      ],
      relations: [
        "chatMemberships",
        "sentMessages",
        "posts",
        "subscribers",
        "subscriptions",
      ],
    });

    return { user };
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findBy({
      username: username,
    });

    if (user.length === 0) {
      throw new NotFoundException("User not found 404");
    }

    const modifiedUser = await Promise.all(
      user.map(async ({ password, avatarPathTo, ...rest }) => {
        const avatarBase64 = await this.fileServise.getFile(avatarPathTo);

        return {
          ...rest,
          avatarBase64,
        };
      })
    );

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

    const modifiedUsers = await Promise.all(
      users.map(async ({ password, avatarPathTo, ...rest }) => {
        const avatarBase64 = await this.fileServise.getFile(avatarPathTo);

        return {
          ...rest,
          avatarBase64,
        };
      })
    );

    return modifiedUsers;
  }

  async findFullDataById(id: number) {
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
        "description",
        "avatarPathTo",
      ],
      relations: ["posts", "subscribers", "subscriptions"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const avatarBase64: string = await this.fileServise.getFile(
      user.avatarPathTo
    );

    const modifiedUser = JSON.parse(JSON.stringify(user));

    delete modifiedUser.avatarPathTo;

    modifiedUser.avatarBase64 = avatarBase64;

    return modifiedUser;
  }

  async findBasicDataById(user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: user_id,
      },
      select: [
        "user_id",
        "fullname",
        "username",
        "email",
        "phone",
        "description",
        "avatarPathTo",
      ],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const avatarBase64: string = await this.fileServise.getFile(
      user.avatarPathTo
    );

    const modifiedUser = JSON.parse(JSON.stringify(user));

    delete modifiedUser.avatarPathTo;

    modifiedUser.avatarBase64 = avatarBase64;

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
      select: [
        "user_id",
        "fullname",
        "username",
        "email",
        "phone",
        "description",
        "avatarPathTo",
      ],
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

    if (updateUserDto.description !== undefined) {
      user.description = updateUserDto.description;
    }

    if (file) {
      const pathTo: string = await this.fileServise.uploadFile(
        file,
        user.username.toString()
      );

      console.log(pathTo);

      user.avatarPathTo = pathTo;
    }

    const updatedUser = await this.userRepository.save(user);

    console.log(updatedUser);

    return updatedUser;
  }
}

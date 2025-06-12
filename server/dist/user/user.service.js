"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const argon2 = require("argon2");
const file_service_1 = require("../services/file.service");
let UserService = class UserService {
    userRepository;
    fileServise;
    constructor(userRepository, fileServise) {
        this.userRepository = userRepository;
        this.fileServise = fileServise;
    }
    async create(createUserDto) {
        const isUserExist = await this.userRepository.findOne({
            where: {
                email: createUserDto.email,
            },
        });
        if (isUserExist) {
            throw new common_1.UnauthorizedException("This email already exists");
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
    async findOne(email) {
        return await this.userRepository.findOne({
            where: {
                email: email,
            },
        });
    }
    async findAll() {
        const users = await this.userRepository.find();
        if (users.length === 0) {
            throw new common_1.NotFoundException("Users not found");
        }
        const modifiedUsers = users.map((user) => {
            const { password, ...rest } = user;
            return rest;
        });
        return modifiedUsers;
    }
    async findByUsername(username) {
        const user = await this.userRepository.findBy({
            username: username,
        });
        if (user.length === 0) {
            throw new common_1.NotFoundException("User not found 404");
        }
        const modifiedUser = user.map((user) => {
            const { password, ...rest } = user;
            return rest;
        });
        return modifiedUser[0];
    }
    async findUsersBySymbol(string) {
        const users = await this.userRepository.find({
            where: {
                username: (0, typeorm_2.Like)(`${string}%`),
            },
        });
        if (users.length === 0) {
            throw new common_1.NotFoundException("Users not found 404");
        }
        const modifiedUsers = users.map((user) => {
            const { password, ...rest } = user;
            return rest;
        });
        return modifiedUsers;
    }
    async findById(id) {
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
            ],
            relations: ["chatMemberships", "sentMessages", "posts"],
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const avatarBase64 = await this.fileServise.getFile(user.avatarPathTo);
        const modifiedUser = JSON.parse(JSON.stringify(user));
        modifiedUser.avatarPathTo = avatarBase64;
        return modifiedUser;
    }
    async updateUser(id, updateUserDto, file) {
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
            ],
            relations: ["chatMemberships", "sentMessages", "posts", "comments"],
        });
        console.log(user);
        if (!user) {
            throw new common_1.NotFoundException();
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
            const pathTo = await this.fileServise.uploadFile(file);
            console.log(pathTo);
            user.avatarPathTo = pathTo;
        }
        const updatedUser = await this.userRepository.save(user);
        console.log(updatedUser);
        return updatedUser;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        file_service_1.FileService])
], UserService);
//# sourceMappingURL=user.service.js.map
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileService } from "src/services/file.service";
export declare class UserService {
    private readonly userRepository;
    private readonly fileServise;
    constructor(userRepository: Repository<User>, fileServise: FileService);
    create(createUserDto: CreateUserDto): Promise<{
        user: {
            fullname: string;
            username: string;
            email: string;
            phone: string;
            password: string;
        } & User;
    }>;
    findOne(email: string): Promise<User | null>;
    findAll(): Promise<{
        user_id: number;
        fullname: string;
        username: string;
        email: string;
        phone: string;
        subscribers: number;
        subscriptions: number;
        description: string;
        avatarPathTo: string;
        chatMemberships: import("../chat-members/entities/chat-member.entity").ChatMember[];
        sentMessages: import("../messages/entities/message.entity").Message[];
        posts: import("../post/entities/post.entity").Post[];
    }[]>;
    findByUsername(username: string): Promise<{
        user_id: number;
        fullname: string;
        username: string;
        email: string;
        phone: string;
        subscribers: number;
        subscriptions: number;
        description: string;
        avatarPathTo: string;
        chatMemberships: import("../chat-members/entities/chat-member.entity").ChatMember[];
        sentMessages: import("../messages/entities/message.entity").Message[];
        posts: import("../post/entities/post.entity").Post[];
    }>;
    findUsersBySymbol(string: string): Promise<{
        user_id: number;
        fullname: string;
        username: string;
        email: string;
        phone: string;
        subscribers: number;
        subscriptions: number;
        description: string;
        avatarPathTo: string;
        chatMemberships: import("../chat-members/entities/chat-member.entity").ChatMember[];
        sentMessages: import("../messages/entities/message.entity").Message[];
        posts: import("../post/entities/post.entity").Post[];
    }[]>;
    findById(id: number): Promise<any>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
}

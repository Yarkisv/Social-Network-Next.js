import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
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
        chatMemberships: import("../chat-members/entities/chat-member.entity").ChatMember[];
        sentMessages: import("../messages/entities/message.entity").Message[];
        posts: import("../post/entities/post.entity").Post[];
    }[]>;
    findById(id: number): Promise<User | null>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
}

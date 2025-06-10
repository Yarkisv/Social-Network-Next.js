import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
        user: {
            fullname: string;
            username: string;
            email: string;
            phone: string;
            password: string;
        } & import("./entities/user.entity").User;
    }>;
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
    findByString(string: string): Promise<{
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
    updateUser(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File): Promise<import("./entities/user.entity").User>;
}

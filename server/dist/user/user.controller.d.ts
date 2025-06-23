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
    findByUsername(username: string): Promise<{
        avatarBase64: string;
        user_id: number;
        fullname: string;
        username: string;
        email: string;
        phone: string;
        subscriptions: import("../subscription/entities/subscription.entity").Subscription[];
        subscribers: import("../subscription/entities/subscription.entity").Subscription[];
        description: string;
        chatMemberships: import("../chat-members/entities/chat-member.entity").ChatMember[];
        sentMessages: import("../messages/entities/message.entity").Message[];
        posts: import("../post/entities/post.entity").Post[];
        comments: import("../comment/entities/comment.entity").Comment[];
    }>;
    findByString(string: string): Promise<{
        avatarBase64: string;
        user_id: number;
        fullname: string;
        username: string;
        email: string;
        phone: string;
        subscriptions: import("../subscription/entities/subscription.entity").Subscription[];
        subscribers: import("../subscription/entities/subscription.entity").Subscription[];
        description: string;
        chatMemberships: import("../chat-members/entities/chat-member.entity").ChatMember[];
        sentMessages: import("../messages/entities/message.entity").Message[];
        posts: import("../post/entities/post.entity").Post[];
        comments: import("../comment/entities/comment.entity").Comment[];
    }[]>;
    updateUser(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File): Promise<import("./entities/user.entity").User>;
}

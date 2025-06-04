import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
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
        chatMemberships: import("../chat-members/entities/chat-member.entity").ChatMember[];
        sentMessages: import("../messages/entities/message.entity").Message[];
    }[]>;
    findByUsername(username: string): Promise<{
        user_id: number;
        fullname: string;
        username: string;
        email: string;
        phone: string;
        chatMemberships: import("../chat-members/entities/chat-member.entity").ChatMember[];
        sentMessages: import("../messages/entities/message.entity").Message[];
    }>;
}

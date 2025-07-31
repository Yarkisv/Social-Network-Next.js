import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/create-auth.dto";
import { UserService } from "src/user/user.service";
import { Response } from "express";
import { PostService } from "src/post/post.service";
import { SubscriptionService } from "src/subscription/subscription.service";
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly postService;
    private readonly subscriptionService;
    constructor(authService: AuthService, userService: UserService, postService: PostService, subscriptionService: SubscriptionService);
    login(loginDto: LoginDto, response: Response): Promise<{
        message: string;
    }>;
    me(req: any): Promise<any>;
    getFullUserData(username: string): Promise<{
        user: {
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
        };
        posts: {
            userAvatar: any;
            username: any;
            imageBase64: string;
            post_id: number;
            post_title: string;
            likes: number;
            comments: import("../comment/entities/comment.entity").Comment[];
            user: import("../user/entities/user.entity").User;
        }[];
        subscriptions: {
            user_id: number;
            username: string;
            fullname: string;
            imageBase64: string;
        }[];
        subscribers: {
            user_id: number;
            username: string;
            fullname: string;
            imageBase64: string;
        }[];
    }>;
    checkToken(req: any): Promise<{
        message: string;
    }>;
    logout(req: any, response: Response): Promise<Response<any, Record<string, any>>>;
    refreshTokens(req: any, response: Response): Promise<void>;
}

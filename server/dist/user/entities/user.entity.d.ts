import { ChatMember } from "src/chat-members/entities/chat-member.entity";
import { Message } from "src/messages/entities/message.entity";
import { Post } from "src/post/entities/post.entity";
export declare class User {
    user_id: number;
    fullname: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    chatMemberships: ChatMember[];
    sentMessages: Message[];
    posts: Post[];
}

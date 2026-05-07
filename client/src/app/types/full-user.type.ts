import { Post } from "./post.type";
import { Subs } from "./subs.type";
import { User } from "./user.type";

export type FullUser = {
  user: User;
  subscriptionStatus: string;
  posts: Post[];
  savedPosts: Post[];
  subscriptions: Subs[];
  subscribers: Subs[];
};

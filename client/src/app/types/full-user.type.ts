import { Post } from "./post.type";
import { Subs } from "./subs.type";
import { User } from "./user.type";

export type FullUser = {
  user: User;
  posts: Post[];
  subscriptions: Subs[];
  subscribers: Subs[];
};

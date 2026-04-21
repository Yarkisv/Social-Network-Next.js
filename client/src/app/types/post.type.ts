import { Like } from "./like.type";

export type Post = {
  post_id: number | undefined;
  images: string[];
  post_title: string | undefined;
  username: string | undefined;
  userAvatar: string | undefined;
  likes: Like[] | undefined;
};

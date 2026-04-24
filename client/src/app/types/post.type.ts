import { Like } from "./like.type";

export type Post = {
  post_id?: number;
  images: string[];
  post_title?: string;
  username?: string;
  userAvatar?: string;
  likes?: Like[];
};

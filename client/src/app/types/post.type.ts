import { Like } from "./like.type";

export type Post = {
  post_id?: number;
  images: { id: number; path_to: string }[];
  post_title?: string;
  username?: string;
  userAvatar?: string;
  comments: [];
  likes?: Like[];
};

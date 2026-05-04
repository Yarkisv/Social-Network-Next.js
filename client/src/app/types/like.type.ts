import { Post } from "./post.type";

export type Like = {
  like_id?: number;
  post: Post;
  likedByUserAvatarBase64?: string;
  likedByUserUsername?: string;
};

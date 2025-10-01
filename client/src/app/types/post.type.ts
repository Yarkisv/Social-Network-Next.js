import { Like } from "./like.type";

export type Post = {
  post_id: number | undefined;
  imageBase64: string | undefined;
  post_title: string | undefined;
  username: string | undefined;
  userAvatar: string | undefined;
  likes: Like[] | undefined;
};

export type Comment = {
  comment_id?: number;
  content?: string;
  senderUsername?: string;
  senderAvatarPathTo?: string;
  likes?: number;
  sent_at?: Date;
};

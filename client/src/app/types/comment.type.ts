export type Comment = {
  comment_id?: number;
  content?: string;
  senderUsername?: string;
  senderAvatarBase64?: string;
  likes?: number;
  sent_at?: Date;
};

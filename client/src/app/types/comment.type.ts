export type Comment = {
  comment_id: number | undefined;
  content: string | undefined;
  senderUsername: string | undefined;
  senderAvatarBase64: string | undefined;
  likes: number | undefined;
  sent_at: Date | undefined;
};

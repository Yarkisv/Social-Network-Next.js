export type Message = {
  message_id?: number;
  media_path?: string;
  type: "text" | "image" | "video" | "file";
  chat_id?: number;
  user_id?: number;
  content?: string;
  time: string;
};

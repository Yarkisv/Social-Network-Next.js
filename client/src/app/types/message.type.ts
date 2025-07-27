export type Message = {
  message_id: number | undefined;
  chat_id: number | undefined;
  sender_id: number | undefined;
  content: string | undefined;
  time: Date | undefined;
};

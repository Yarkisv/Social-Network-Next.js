import { io, Socket } from "socket.io-client";

export class SocketApi {
  static socket: null | Socket = null;

  static createConnection(): void {
    this.socket = io("http://localhost:4000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected");
    });

    this.socket.on("disconnect", (e) => {
      console.log("Disconnected: ", e);
    });

    this.socket.on("newMessage", (data) => {
      console.log("Raw socket data:", data);
      console.log("Data types:", {
        message_id: typeof data.message_id,
        content: typeof data.content,
        user_id: typeof data.user_id,
        chat_id: typeof data.chat_id,
        time: typeof data.time,
      });
    });
  }

  static disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

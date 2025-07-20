import { io, Socket } from "socket.io-client";

export class SocketApi {
  static socket: null | Socket = null;

  static createConnection() {
    this.socket = io("http://localhost:4000", {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected");
    });

    this.socket.on("disconnect", (e) => {
      console.log("Disconnected");
    });
  }
}

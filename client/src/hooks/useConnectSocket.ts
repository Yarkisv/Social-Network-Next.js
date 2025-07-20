import { SocketApi } from "@/api/socket-api";
import { useEffect } from "react";

export const useConnectSocket = () => {
  const connectSocket = () => {
    SocketApi.createConnection();
  };

  useEffect(() => {
    connectSocket();
  }, []);
};

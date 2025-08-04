"use client";

import { ReactNode, useEffect } from "react";
import { SocketApi } from "@/api/socket-api";

export function SocketProviderContext({ children }: { children: ReactNode }) {
  useEffect(() => {
    SocketApi.createConnection();

    return () => {
      SocketApi.disconnect();
    };
  }, []);

  return children;
}

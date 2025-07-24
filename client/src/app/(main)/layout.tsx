"use client";

import "../globals.css";
import Header from "../components/Header";
import { store } from "../store/index";
import { Provider } from "react-redux";
import UploadPostModal from "../components/modals/UploadPostModal";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  const checkThatAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/check-token");

      if (response.status !== 200) {
        redirect("/login");
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        redirect("/login");
      } else {
        console.log("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    checkThatAuth();
  }, []);

  if (loading)
    return (
      <html lang="en">
        <body>
          <p>Loading</p>
        </body>
      </html>
    );

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Header />
          {children}
          <UploadPostModal />
        </Provider>
      </body>
    </html>
  );
}

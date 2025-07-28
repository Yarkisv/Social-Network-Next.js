// "use client";

import "../globals.css";
import Header from "../components/Header";
import { store } from "../store/index";
import { Provider } from "react-redux";
import UploadPostModal from "../components/modals/UploadPostModal";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { ReduxProvider } from "./providers";
import { getUser } from "@/lib/getUser";
import { HydrateUser } from "../components/hydrate/HydrateUser";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <HydrateUser user={user} />
          <Header user={user} />
          {children}
          <UploadPostModal />
        </ReduxProvider>
      </body>
    </html>
  );
}

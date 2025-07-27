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
  // const [loading, setLoading] = useState<boolean>(true);

  // const checkThatAuth = async () => {
  //   try {
  //     const response = await axiosInstance.get("/auth/check-token");

  //     if (response.status !== 200) {
  //       redirect("/login");
  //     } else {
  //       setLoading(false);
  //     }
  //   } catch (error: any) {
  //     if (error.response.status === 401) {
  //       redirect("/login");
  //     } else {
  //       console.log("Unexpected error:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   checkThatAuth();
  // }, []);

  // if (loading)
  //   return (
  //     <html lang="en">
  //       <body>
  //         <p>Loading</p>
  //       </body>
  //     </html>
  //   );

  const user = await getUser();

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <HydrateUser user={user} />
          <Header />
          {children}
          <UploadPostModal />
        </ReduxProvider>
      </body>
    </html>
  );
}

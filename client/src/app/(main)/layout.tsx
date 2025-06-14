"use client";

import "../globals.css";
import Header from "../components/Header";
import { store } from "../store/index";
import { Provider } from "react-redux";
// import SearchUsersPanel from "../components/Panels/SearchUsersPanel";
import UploadPostModal from "../components/modals/UploadPostModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Header />
          {children}
          {/* <SearchUsersPanel /> */}
          <UploadPostModal />
        </Provider>
      </body>
    </html>
  );
}

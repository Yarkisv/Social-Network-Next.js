"use client";

import "../globals.css";
import Header from "../components/Header";
import { store } from "../store/index";
import { Provider } from "react-redux";
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
          <UploadPostModal />
        </Provider>
      </body>
    </html>
  );
}

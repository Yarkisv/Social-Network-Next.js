import "../globals.css";
import Header from "../components/Header";
import { redirect } from "next/navigation";
import { ReduxProvider } from "./providers";
import { getUser } from "@/lib/getUser";
import { HydrateUser } from "../components/hydrate/HydrateUser";
import { SocketProviderContext } from "../contexts/SocketProviderContext";
import AsideInfo from "../components/asideInfo";

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
        <SocketProviderContext>
          <ReduxProvider>
            <HydrateUser user={user} />
            <Header user={user} />
            <div className="flex flex-1 bg-[#060606] text-white flex justify-center px-4 ">
              <div className="w-[200px] bg-[#15121F] ">
                <AsideInfo />
              </div>
              <div className="w-full max-w-[730px]">{children}</div>
            </div>
          </ReduxProvider>
        </SocketProviderContext>
      </body>
    </html>
  );
}

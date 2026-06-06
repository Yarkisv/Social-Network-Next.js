import "../globals.css";
import Header from "../components/Header";
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

  return (
    <html lang="en">
      <body>
        <SocketProviderContext>
          <ReduxProvider>
            <HydrateUser user={user} />
            <Header user={user} />
            <div className="flex justify-center">
              <aside className="w-[200px]">
                <div className="sticky top-[46px] h-[calc(100vh-46px)] bg-[#15121F]">
                  <AsideInfo />
                </div>
              </aside>

              <main className="w-full max-w-[730px]">{children}</main>
            </div>
          </ReduxProvider>
        </SocketProviderContext>
      </body>
    </html>
  );
}

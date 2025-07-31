import "../globals.css";
import Header from "../components/Header";
import { redirect } from "next/navigation";
import { ReduxProvider } from "./providers";
import { getUser } from "@/lib/getUser";
import { HydrateUser } from "../components/hydrate/HydrateUser";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (user.statusCode === 404) {
    redirect("/login");
  }

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <HydrateUser user={user} />
          <Header user={user} />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

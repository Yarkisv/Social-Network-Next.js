import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/api");

  if (isPublic) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;

  console.log("Access token: ", accessToken);

  if (!accessToken) {
    console.log("Access token not found — trying refresh...");

    const refreshUrl = new URL("/api/refresh", req.url);
    const refreshRes = await fetch(refreshUrl, {
      method: "POST",
      headers: { cookie: req.headers.get("cookie") || "" },
    });

    const setCookieHeader = refreshRes.headers.get("set-cookie");

    if (refreshRes.ok && setCookieHeader) {
      console.log("Tokens refreshed — injecting cookies to response");

      const response = NextResponse.next();
      response.headers.set("set-cookie", setCookieHeader);

      return response;
    } else {
      console.log("Refresh failed — redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

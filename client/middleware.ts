import { NextRequest, NextResponse } from "next/server";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export async function middleware(request: NextRequest) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const discpath = useAppDispatch();

  const access_token = request.cookies.get("access_token")?.value;
  const refresh_token = request.cookies.get("refresh_token")?.value;

  try {
    if (!access_token) {
      const refresh = await fetch(`${API}/auth/refresh`, {
        method: "GET",
        headers: {
          cookie: request.headers.get("refresh_token") || "",
        },
      });

      if (refresh.ok) {
        const response = NextResponse.next();

        return response;
      }
    }

    return NextResponse.redirect(new URL("/login", request.url));
  } catch (error) {
    console.log("Error: ", error);
  }
}

export const config = {
  matcher: ["/profile"],
};

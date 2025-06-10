import { NextRequest, NextResponse } from "next/server";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const access_token = request.cookies.get("access_token")?.value;

  try {
    if (!access_token) {
      const res = await axios.get(`${API}/auth/profile`, {
        withCredentials: true,
      });

      if (res.status === 200) {
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

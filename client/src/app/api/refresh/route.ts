import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const backendUrl = `${API}/auth/refresh`;

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
      credentials: "include",
    });

    const setCookieHeader = backendRes.headers.get("set-cookie");
    const data = await backendRes.text();

    const response = NextResponse.json(
      { message: "Tokens refreshed successfully", raw: data },
      { status: backendRes.status }
    );

    if (setCookieHeader) {
      //Запись токенов с неста в httpOnly куки
      response.headers.set("set-cookie", setCookieHeader);
      console.log("Set tokens into response headers ");
    } else {
      console.log("No Set-Cookie from backend");
    }

    return response;
  } catch (err) {
    console.error("Error during /api/refresh:", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

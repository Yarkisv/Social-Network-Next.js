import { cookies } from "next/headers";

export async function getUser() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  try {
    const response = await fetch(`${API}/auth/me`, {
      headers: { cookie: cookieHeader },
      credentials: "include",
    });

    if (!response.ok) return null;

    return response.json();
  } catch (error) {
    console.log(error);
  }
}

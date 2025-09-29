import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  try {
    const response = await fetch(`${API}/auth/me`, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

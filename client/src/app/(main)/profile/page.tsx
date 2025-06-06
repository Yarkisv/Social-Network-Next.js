"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function page() {
  type User = {
    fullname: string;
    username: string;
    email: string;
    phone: string;
  };

  const [user, setUser] = useState<User>();

  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkToken = async () => {
      try {
        const access_token =
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("access_token");

        if (!access_token) {
          router.push("/");
        }

        const res = await axios.get(`${API}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    checkToken();
  }, []);

  return <div>Profile</div>;
}

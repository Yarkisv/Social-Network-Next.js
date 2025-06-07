"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { initialUser } from "@/app/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export default function page() {
  type User = {
    user_id: number;
    fullname: string;
    username: string;
    email: string;
    phone: string;
    subscribers: number;
    subscriptions: number;
    description: string;
  };

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [user, setUser] = useState<User>();

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const access_token =
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("access_token");

        console.log(access_token);

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
          dispatch(initialUser(res.data));
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    checkToken();
  }, []);

  const updateUserData = async () => {
    try {
      const res = await axios.patch(`${API}/user/update/${user?.user_id}`, {});

      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  if (!user) {
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Профиль пользователя
        </h1>

        <div className="flex justify-between border-b border-gray-300 pb-2 text-gray-700 font-medium">
          <span>Полное имя</span>
          <span>{user.fullname}</span>
        </div>

        <div className="flex justify-between border-b border-gray-300 py-2 text-gray-700 font-medium">
          <span>Имя пользователя</span>
          <span>{user.username}</span>
        </div>

        <div className="flex justify-between border-b border-gray-300 py-2 text-gray-700 font-medium">
          <span>Email</span>
          <span>{user.email}</span>
        </div>

        <div className="flex justify-between border-b border-gray-300 py-2 text-gray-700 font-medium">
          <span>Телефон</span>
          <span>{user.phone}</span>
        </div>

        <div className="flex justify-between border-b border-gray-300 py-2 text-gray-700 font-medium">
          <span>Подписчики</span>
          <span>{user.subscribers ?? 0}</span>
        </div>

        <div className="flex justify-between pt-2 text-gray-700 font-medium">
          <span>Подписки</span>
          <span>{user.subscriptions ?? 0}</span>
        </div>
      </div>

      <div>
        <form onSubmit={updateUserData}>
          <input type="text" placeholder="Change your username" />
        </form>
      </div>
    </div>
  );
}

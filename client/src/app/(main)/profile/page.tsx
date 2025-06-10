"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import profileEmpty from "../../images/profileEmpty.png";
import ProfilePost from "../../images/ProfilePost.png";
import Image from "next/image";
import { initialUser } from "@/app/store/slices/userSlice";
import { useAppDispatch } from "@/app/hooks";

export default function Page() {
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
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get(`${API}/auth/profile`, {
          withCredentials: true,
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

  if (!user) {
    return <div className="min-h-screen bg-[#060606]"></div>;
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4 py-8">
      <div className="w-full max-w-[730px]">
        {/* Header */}
        <div className="flex items-start gap-6 mb-10">
          <Image
            src={profileEmpty}
            alt="Google"
            className="w-28 h-28 rounded-full "
          />

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-[15px]">
              <div className="text-xl font-semibold">{user.fullname}</div>
              <div className="text-gray-400">@{user.username}</div>
            </div>

            <div className="flex gap-8 text-sm text-gray-300">
              <div>
                <span className="text-white font-medium">10</span> posts
              </div>
              <div>
                <span className="text-white font-medium">
                  {user.subscribers ?? 0}
                </span>{" "}
                followers
              </div>
              <div>
                <span className="text-white font-medium">
                  {user.subscriptions ?? 0}
                </span>{" "}
                subscriptions
              </div>
            </div>
            <div className="text-gray-300 ">
              {user.description || "pipipupu gaga"}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-12  mb-4">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 text-sm font-semibold ${
              activeTab === "posts"
                ? "border-b-2 border-white text-white"
                : "text-gray-500"
            }`}
          >
            POSTS
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-2 text-sm font-semibold ${
              activeTab === "saved"
                ? "border-b-2 border-white text-white"
                : "text-gray-500"
            }`}
          >
            SAVED
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-[5px]">
          {(activeTab === "posts" ? [...Array(6)] : [...Array(3)]).map(
            (_, index) => (
              <Image
                key={index}
                src={ProfilePost}
                alt="Google"
                className="w-full aspect-square object-cover"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

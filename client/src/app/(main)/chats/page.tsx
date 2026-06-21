"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import NoChats from "../../images/NoChats.svg";

import axiosInstance from "@/lib/axios";
import { Chat } from "@/app/types/chat.type";
import { useRouter } from "next/navigation";

export default function page() {
  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;

  const [chats, setChats] = useState<any[]>([]);

  const router = useRouter();

  const fetchAllUserChats = async () => {
    try {
      const response = await axiosInstance.get("/chat/get/all");

      if (response.status === 200) {
        console.log(response.data);
        setChats(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChat = async (chat_id: number) => {
    try {
      const response = await axiosInstance.delete(`chat/delete/${chat_id}`);

      if (response.status === 200) {
        fetchAllUserChats();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToChat = (chat_id: number | undefined) => {
    router.push(`/chats/${chat_id}`);
  };

  useEffect(() => {
    fetchAllUserChats();
  }, []);

  return (
    <div className="h-[calc(100vh-46px)] text-white flex justify-center w-full max-w-[730px] bg-[#120921] flex pt-[20px] px-[20px] font-[Manrope]">
      <div className="w-full flex flex-col gap-[20px]">
        {chats?.length > 0 ? (
          <div>
            {chats.map((chat) => (
              <div
                key={chat.chat_id}
                className="flex p-[5px] cursor-pointer hover:bg-[#1E1B2E] rounded-md transition-colors duration-200"
                onClick={() => navigateToChat(chat.chat_id)}
              >
                <Image
                  src={`${STATIC_API}/${chat.avatarPathTo}`}
                  alt="avatar"
                  width={46}
                  height={46}
                  className="h-[46px] w-[46px] object-cover rounded-full"
                />

                <div className="ml-[10px] flex flex-col justify-center flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-[Space_Grotesk] font-[400] text-white">
                      {chat.chatName}
                    </p>

                    {chat.unreadCount > 0 && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-[2px] rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.chat_id);
                      }}
                      className="group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      Delete chat
                    </button>
                  </div>

                  <p className="text-sm text-white/60 truncate max-w-[500px]">
                    {chat.lastMessage?.content ?? "No messages yet"}
                  </p>

                  {chat.lastMessage?.sent_at && (
                    <p className="text-[11px] text-white/40">
                      {new Date(chat.lastMessage.sent_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-center text-white/70">
            <Image
              src={NoChats}
              alt="Saved post"
              className=" h-[40px] w-[40px] object-cover mb-[5px]"
            />
            <p className="text-lg font-semibold">No chats yet</p>
            <p className="text-sm text-white/50">
              Start a conversation to see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

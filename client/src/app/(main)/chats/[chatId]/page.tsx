"use client";

import AsideInfo from "@/app/components/asideInfo";
import Image from "next/image";
import likeChat from "../../../images/likeChat.svg";
import NoChats from "../../../images/NoChats.svg";

import AddFiile from "../../../images/AddFiile.svg";
import sendMessageButton from "../../../images/sendMessageButton.svg";

import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Chat } from "@/app/types/chat.type";
import { useConnectSocket } from "@/hooks/useConnectSocket";
import { SocketApi } from "@/api/socket-api";
import { Message } from "@/app/types/message.type";
import axios from "axios";

export default function page() {
  const [chat, setChat] = useState<Chat>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const params = useParams();

  const chat_id = params.chatId;

  useConnectSocket();

  const fetchChatInfo = async () => {
    try {
      const response = await axiosInstance.get(`chat/get/${chat_id}`);

      if (response.status === 200) {
        setChat(response.data);

        fetchAllMessages();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        redirect("/chats");
      } else {
        console.log("Unexpected error:", error);
      }
    }
  };

  const fetchAllMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/messages/get/${chat_id}`
      );

      if (response.status === 200) {
        const modifiedMessages = response.data.map((message: any) => {
          const date = new Date(message.sent_at);

          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");

          return {
            ...message,
            time: `${hours}:${minutes}`,
          };
        });

        setMessages(modifiedMessages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChatInfo();

    SocketApi.socket?.on("newMessage", (message) => {
      setMessages((prev) => {
        const date = new Date(message.sent_at);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        const modifiedMessage = {
          ...message,
          time: `${hours}:${minutes}`,
        };

        return [...prev, modifiedMessage];
      });
    });
  }, [chat_id]);

  const sendMessage = () => {
    const payload = {
      chat_id: chat_id,
      content: message,
    };

    if (message.length > 0) {
      SocketApi.socket?.emit("message", payload);
    }

    setMessage("");
  };

  if (!chat) {
    return null;
  }

  return (
    <div className="min-h-screen  bg-[#060606] text-white flex justify-center">
      <div className="w-[198px] bg-[#15121F]">
        <AsideInfo />
      </div>
      <div className="w-full relative max-w-[730px] flex flex-col flex-1 bg-[#120921] px-[24px] pt-[24px] gap-4 font-[Manrope] rounded-[2px] shadow-lg">
        <header className="flex items-center border-b border-[#2f2f2f] pb-3">
          <Image
            src={`data:image/png;base64,${chat.avatarBase64}`}
            alt="Chat avatar"
            height={10}
            width={10}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <h2 className="text-xl font-semibold text-white">{chat?.chatName}</h2>
        </header>

        <div className="flex flex-col flex-1 overflow-hidden">
          <section className="flex-1 overflow-y-auto flex flex-col gap-3 w-full font-[Space_Grotesk] pr-1 pb-2">
            {messages.length > 0 ? (
              <div className="flex flex-col gap-2 justify-end h-full">
                {messages.map((message) =>
                  message.sender_id !== chat.user_id ? (
                    <div
                      className="self-end ml-auto my-[6px] bg-green-600 rounded-[6px] rounded-br-[0px] max-w-[70%] flex flex-col py-2 px-3"
                      key={`${message.message_id}-${message.time}`}
                    >
                      <div className="flex justify-between items-center gap-[60px] mb-1">
                        <p className="text-sm font-medium text-white">You</p>
                        <span className="text-xs text-gray-300">
                          {message.time?.toString()}
                        </span>
                      </div>
                      <p className="font-[200] text-sm text-white break-words whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex relative justify-end mt-1">
                        <Image
                          src={likeChat}
                          alt="Like icon"
                          className="h-[12px] absolute bottom-[5px] w-[12px] cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="self-start my-[6px] bg-[#252037] ml-[10px] rounded-[6px] rounded-bl-[0px] max-w-[70%] flex flex-col py-2 px-3"
                      key={`${message.message_id}-${message.time}`}
                    >
                      <div className="flex justify-between items-center gap-[20px] mb-1">
                        <p className="text-sm font-medium text-white">Web</p>
                        <span className="text-xs text-gray-300">
                          {message.time?.toString()}
                        </span>
                      </div>
                      <p className="font-[200] text-sm text-white break-words whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex relative justify-end mt-1">
                        <Image
                          src={likeChat}
                          alt="Like icon"
                          className="h-[12px] absolute bottom-[5px] w-[12px] cursor-pointer"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-20 text-center text-white/70">
                <Image
                  src={NoChats}
                  alt="Saved post"
                  className="h-[40px] w-[40px] object-cover mb-[5px]"
                />
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm text-white/50">
                  Write your first message here.
                </p>
              </div>
            )}
          </section>
        </div>
        <footer className="flex sticky bottom-0 items-center gap-[8px] p-3 bg-[#1c1c1e] border-t border-[#2a2a2e] rounded-t-xl shadow-lg">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-[#333] outline-none"
          />

          <button className="w-[50px] h-[50px] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg bg-[#9333EA] hover:bg-[#7e22ce] flex items-center justify-center">
            <Image
              src={message.trim() ? sendMessageButton : AddFiile}
              alt="Action icon"
              className="h-[20px] w-[20px] cursor-pointer object-contain"
              onClick={sendMessage}
            />
          </button>
        </footer>
      </div>
    </div>
  );
}

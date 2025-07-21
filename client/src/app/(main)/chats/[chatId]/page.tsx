"use client";

import AsideInfo from "@/app/components/asideInfo";
import Image from "next/image";
import AsideSettings from "../../../images/AsideImg/AsideSettings.svg";
import ProfilePost from "../../../images/ProfilePost.png";
import profileEmpty from "../../../images/profileEmpty.png";
import likeChat from "../../../images/likeChat.svg";
import NoChats from "../../../images/NoChats.svg";

import AddFiile from "../../../images/AddFiile.svg";
import sendMessageButton from "../../../images/sendMessageButton.svg";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Chat } from "@/app/types/chat.type";
import { useConnectSocket } from "@/hooks/useConnectSocket";
import { SocketApi } from "@/api/socket-api";
import { Message } from "@/app/types/message.type";
import axios from "axios";

export default function page() {
  const [chat, setChat] = useState<Chat>();

  const params = useParams();

  const chat_id = params.chatId;

  const fetchChatInfo = async () => {
    try {
      const response = await axiosInstance.get(`chat/get/${chat_id}`);

      if (response.status === 200) {
        setChat(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/messages/get/${1}`
      );

      if (response.status === 200) {
        setMessages(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChatInfo();
  }, []);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useConnectSocket();

  useEffect(() => {
    fetchAllMessages();

    SocketApi.socket?.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, []);

  const sendMessage = () => {
    const payload = {
      chat_id: 1,
      sender_id: 1,
      content: message,
      sent_at: new Date().toString(),
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
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4">
      <div className="w-[198px] bg-[#15121F]">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] flex flex-col flex-1 bg-[#120921] p-5 font-[Manrope]">
        <header className="flex items-center border-b border-[#2f2f2f] pb-3 mb-4">
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
          <section className="flex-1 overflow-y-auto flex flex-col gap-3  w-full font-[Space_Grotesk] rounded-[2px] pr-1 pb-[70px]">
            {messages.length > 0 ? (
              <div>
                {messages.map((message) =>
                  message.sender_id === 1 ? (
                    <div
                      className="self-end flex my-[10px] bg-[#252037] ml-[10px]   rounded-[2px] w-[55%] items-center"
                      key={message.message_id}
                    >
                      <div className="ml-[10px] flex flex-col flex-1">
                        <p className="font-[200] text-sm mb-[5px]">
                          Web dev team
                        </p>
                        <p className="font-[200] text-sm text-white break-words whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <div className="ml-auto flex flex-col items-center justify-center gap-[10px] mr-[10px]">
                        <span className="text-xs text-gray-400">
                          {message.sent_at?.toString()}
                        </span>
                        <Image
                          src={likeChat}
                          alt="Like icon"
                          className="h-[10px] w-[10px] cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="ml-[10px]  flex flex-col flex-1">
                        <p className="font-[200] text-sm mb-[5px]">Web dev</p>
                        <p className="font-[200] text-sm text-white break-words whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <div className="ml-auto flex flex-col items-center justify-center gap-[10px] mr-[10px]">
                        <span className="text-xs text-gray-400">
                          {message.sent_at?.toString()}
                        </span>
                        <Image
                          src={likeChat}
                          alt="Like icon"
                          className="h-[10px] w-[10px] cursor-pointer"
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
                  className=" h-[40px] w-[40px] object-cover mb-[5px]"
                />
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm text-white/50">
                  Write your first message here.
                </p>
              </div>
            )}
          </section>

          <footer className="sticky bottom-0 left-0 right-0 flex items-center gap-[8px] p-3 bg-[#1c1c1e] border-t border-[#2a2a2e] rounded-t-xl shadow-lg z-10">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-[#1a1a1a]  text-white border border-[#333] outline-none"
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
    </div>
  );
}

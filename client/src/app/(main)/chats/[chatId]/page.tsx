"use client";

import AsideInfo from "@/app/components/asideInfo";
import Image from "next/image";
import AsideSettings from "../../../images/AsideImg/AsideSettings.svg";
import ProfilePost from "../../../images/ProfilePost.png";
import profileEmpty from "../../../images/profileEmpty.png";
import likeChat from "../../../images/likeChat.svg";
import AddFiile from "../../../images/AddFiile.svg";
import sendMessage from "../../../images/sendMessage.svg";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Chat } from "@/app/types/chat.type";

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

  useEffect(() => {
    fetchChatInfo();
  }, []);
  const [message, setMessage] = useState("");

  if (!chat) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4">
      <div className="w-[198px] bg-[#15121F]">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] h-screen bg-[#120921] flex flex-col p-5 font-[Manrope]">
        <header className="flex items-center border-b border-[#2f2f2f] pb-3 mb-4">
          <Image
            src={`data:image/png;base64,${chat.avatarBase64}`}
            alt="Chat avatar"
            height={10}
            width={10}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <h2 className="text-xl font-semibold text-white">{chat?.chatName}</h2>
          {/* <Image
        src={AsideSettings}
        alt="Saved post"
        className=" h-[20px] w-[20px] ml-[10px] object-cover "
      /> */}
        </header>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <section className="flex-1 overflow-y-auto flex flex-col gap-3 w-full font-[Space_Grotesk] rounded-[2px] pr-1 pb-[100px]">
            <div className="self-start flex my-[5px] bg-[#252037] ml-[15px] rounded-[2px] w-[98%] items-center">
              <Image
                src={ProfilePost}
                alt="Saved post"
                className="h-[55px] w-[55px] ml-[-15px] object-cover rounded-full"
              />
              <div className="ml-[10px] flex flex-col flex-1">
                <p className="font-[200] text-sm mb-[5px]">Web dev team</p>
                <p className="font-[200] text-sm text-white">Hello! 👋</p>
              </div>
              <div className="ml-auto flex flex-col items-center justify-center gap-[10px] mr-[10px]">
                <span className="text-xs text-gray-400">10:00</span>
                <Image
                  src={likeChat}
                  alt="Like icon"
                  className="h-[10px] w-[10px] cursor-pointer"
                />
              </div>
            </div>

            <div className="self-start flex my-[5px] bg-[#393154] ml-[15px] rounded-[2px] w-[98%] items-center">
              <Image
                src={profileEmpty}
                alt="Saved post"
                className="h-[55px] w-[55px] ml-[-15px] object-cover rounded-full"
              />
              <div className="ml-[10px] flex flex-col flex-1">
                <p className="font-[200] text-sm mb-[5px]">AJAV studio</p>
                <p className="font-[200] text-sm text-white">
                  Hi! Ready to code?
                </p>
              </div>
              <div className="ml-auto flex flex-col items-center justify-center gap-[10px] mr-[10px]">
                <span className="text-xs text-gray-400">10:00</span>
                <Image
                  src={likeChat}
                  alt="Like icon"
                  className="h-[10px] w-[10px] cursor-pointer"
                />
              </div>
            </div>

            <div className="self-start flex my-[5px] bg-[#252037] ml-[15px] rounded-[2px] w-[98%] items-center">
              <Image
                src={ProfilePost}
                alt="Saved post"
                className="h-[55px] w-[55px] ml-[-15px] object-cover rounded-full"
              />
              <div className="ml-[10px] flex flex-col flex-1">
                <p className="font-[200] text-sm mb-[5px]">Web dev team</p>
                <p className="font-[200] text-sm text-white">Always</p>
              </div>
              <div className="ml-auto flex flex-col items-center justify-center gap-[10px] mr-[10px]">
                <span className="text-xs text-gray-400">10:00</span>
                <Image
                  src={likeChat}
                  alt="Like icon"
                  className="h-[10px] w-[10px] cursor-pointer"
                />
              </div>
            </div>
          </section>

          <footer className="absolute bottom-0 left-0 right-0 flex items-center gap-[8px] p-3 bg-[#1c1c1e] border-t border-[#2a2a2e] rounded-t-xl shadow-lg">
            <textarea
              placeholder="Type a message..."
              rows={1}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 resize-none px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-[#333] outline-none"
            />

            {/* <textarea
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 resize-none px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-[#333] outline-none"
            /> */}

            <button className="w-[50px] h-[50px] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg bg-[#9333EA] hover:bg-[#7e22ce] flex items-center justify-center">
              <Image
                src={message.trim() ? sendMessage : AddFiile}
                alt="Action icon"
                className="h-[20px] w-[20px] object-contain"
              />
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

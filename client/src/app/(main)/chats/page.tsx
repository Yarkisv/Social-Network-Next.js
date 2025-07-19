"use client";

import AsideInfo from "@/app/components/asideInfo";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProfilePost from "../../images/ProfilePost.png";
import axiosInstance from "@/lib/axios";
import { Chat } from "@/app/types/chat.type";
import { useRouter } from "next/navigation";

export default function page() {
  const [chats, setChats] = useState<Chat[]>([]);

  const router = useRouter();

  const fetchAllUserChats = async () => {
    try {
      const response = await axiosInstance.get("/chat/get/all");

      if (response.status === 200) {
        console.log("Chats: ", response.data);
        setChats(response.data);
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
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4">
      <div className="w-[198px] bg-[#15121F]">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] bg-[#120921] flex pt-[20px] px-[20px] font-[Manrope]">
        <div className="w-[520px] flex flex-col gap-[20px]">
          {chats?.length > 0 ? (
            <div>
              {chats.map((chat) => (
                <div
                  className="flex p-[5px] cursor-pointer"
                  key={chat.chat_id}
                  onClick={() => navigateToChat(chat.chat_id)}
                >
                  <Image
                    src={ProfilePost}
                    alt="Saved post"
                    className=" h-[46px] w-[46px] object-cover rounded-full"
                  />
                  <div className="ml-[5px] font-[Space_Grotesk] font-[200] ">
                    <p>Web dev team</p>
                    <p>message</p>
                  </div>
                  <div className="ml-auto mr-[20px] flex flex-col gap-[4px]  items-center ">
                    <p className="font-[Space_Grotesk] font-[200] text-[14px]">
                      3:05
                    </p>
                    <p className="bg-[#C084FC] rounded-[10px] text-[13px] px-[5px]">
                      322
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p>No chats yet</p>
            </div>
          )}
        </div>
        {/* <div className="w-[170px] flex flex-col gap-[10px] border-l-2 border-[#120921] pl-[5px]">
          <p className="font-[Space_Grotesk] font-[200] text-[14px] text-nowrap ">
            Уou may be familiar with
          </p>
          <div className="flex gap-[6px] pl-[10px] font-[Space_Grotesk] font-[200]">
            <Image
              src={ProfilePost}
              alt="Saved post"
              className=" h-[33px] w-[33px] object-cover rounded-full"
            />
            <div>
              <p className="text-[14px]">Pipdastr</p>
              <p className="text-[10px] text-[#959595]">7700 followers</p>
            </div>
          </div>
          <div className="flex gap-[6px] pl-[10px] font-[Space_Grotesk] font-[200]">
            <Image
              src={ProfilePost}
              alt="Saved post"
              className=" h-[33px] w-[33px] object-cover rounded-full"
            />
            <div>
              <p className="text-[14px]">Pipdastr</p>
              <p className="text-[10px] text-[#959595]">7700 followers</p>
            </div>
          </div>
          <div className="flex gap-[6px] pl-[10px] font-[Space_Grotesk] font-[200]">
            <Image
              src={ProfilePost}
              alt="Saved post"
              className=" h-[33px] w-[33px] object-cover rounded-full"
            />
            <div>
              <p className="text-[14px]">Pipdastr</p>
              <p className="text-[10px] text-[#959595]">7700 followers</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

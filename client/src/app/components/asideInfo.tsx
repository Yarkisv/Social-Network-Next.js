"use client";

import React from "react";
import AsideChats from "../images/AsideImg/AsideChats.svg";
import AsideFriends from "../images/AsideImg/AsideFriends.svg";
import AsideMusic from "../images/AsideImg/AsideMusic.svg";
import AsidePosts from "../images/AsideImg/AsidePosts.svg";
import AsideSettings from "../images/AsideImg/AsideSettings.svg";
import AsideVideo from "../images/AsideImg/AsideVideo.svg";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function AsideInfo() {
  const handleSettingsNavigate = () => {
    redirect("/settings");
  };

  const handleChatsClick = () => {
    redirect("/chats");
  };

  return (
    <div className="text-white max-w-[198px] border-l-[2px] border-[#0D0D0D] ">
      <div className="flex flex-col pl-[20px] gap-[20px]">
        <div
          className="flex gap-[5px]  mt-[20px] cursor-pointer"
          onClick={handleChatsClick}
        >
          <Image
            alt="profile"
            src={AsideChats}
            width={19}
            height={19}
            style={{ width: "19px", height: "19px" }}
          />
          <p>Chats</p>
        </div>
        <div className="flex gap-[5px] cursor-pointer">
          <Image
            alt="profile"
            src={AsidePosts}
            width={19}
            height={19}
            style={{ width: "19px", height: "19px" }}
          />
          <p>Posts</p>
        </div>
        <div className="flex gap-[5px] cursor-pointer">
          <Image
            alt="profile"
            src={AsideFriends}
            width={19}
            height={19}
            style={{ width: "19px", height: "19px" }}
          />
          <p>Friends</p>
        </div>
        <div className="flex gap-[5px] cursor-pointer">
          <Image
            alt="profile"
            src={AsideMusic}
            width={19}
            height={19}
            style={{ width: "19px", height: "19px" }}
          />
          <p>Music</p>
        </div>
        <div className="flex gap-[5px] cursor-pointer">
          <Image
            alt="profile"
            src={AsideVideo}
            width={19}
            height={19}
            style={{ width: "19px", height: "19px" }}
          />
          <p>Video</p>
        </div>
        <div
          className="flex gap-[5px] cursor-pointer"
          onClick={handleSettingsNavigate}
        >
          <Image
            alt="profile"
            src={AsideSettings}
            width={19}
            height={19}
            style={{ width: "19px", height: "19px" }}
          />
          <p>Settings</p>
        </div>
      </div>
    </div>
  );
}

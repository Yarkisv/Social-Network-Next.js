import AsideInfo from "@/app/components/asideInfo";
import React from "react";
import Image from "next/image";
import ProfilePost from "../../images/ProfilePost.png";

export default function page() {
  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4">
      <div className="w-[198px] bg-[#15121F]">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] flex pt-[20px] px-[20px] font-[Manrope]">
        <div className="w-[520px] flex flex-col gap-[20px]">
          <div className="flex">
            <Image
              src={ProfilePost}
              alt="Saved post"
              className=" h-[46px] w-[46px] object-cover rounded-full"
            />
            <div className="ml-[5px] font-[Space_Grotesk] font-[200] ">
              <p>Web dev team</p>
              <p>JarikPidoras: lorem ipsum dolor pipa pupa aboba...</p>
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
          <div className="flex">
            <Image
              src={ProfilePost}
              alt="Saved post"
              className=" h-[46px] w-[46px] object-cover rounded-full"
            />
            <div className="ml-[5px] font-[Space_Grotesk] font-[200] ">
              <p>Web dev team</p>
              <p>JarikPidoras: lorem ipsum dolor pipa pupa aboba...</p>
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
          <div className="flex">
            <Image
              src={ProfilePost}
              alt="Saved post"
              className=" h-[46px] w-[46px] object-cover rounded-full"
            />
            <div className="ml-[5px] font-[Space_Grotesk] font-[200] ">
              <p>Web dev team</p>
              <p>JarikPidoras: lorem ipsum dolor pipa pupa aboba...</p>
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
        </div>
        <div className="w-[170px] flex flex-col gap-[10px] border-l-2 border-[#120921] pl-[5px]">
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
        </div>
      </div>
    </div>
  );
}

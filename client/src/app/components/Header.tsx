"use client";

import { useEffect, useState } from "react";
import LogOut from "../images/LogOut.svg";
import SearchIcon from "../images/SearchIcon.svg";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../hooks";
import { openModal, setSearchQuery } from "../store/slices/modalSlice";
import SearchUsersPanel from "../components/Panels/SearchUsersPanel";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { User } from "../types/user.type";

export default function Header({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const [inputText, setInputText] = useState<string>("");

  const handleInputClick = () => {
    if (!isOpen) dispatch(openModal());
  };

  const handleOnChange = () => {
    dispatch(setSearchQuery(inputText));
  };

  const handleLogoutClick = async () => {
    try {
      console.log("Sendeing request");

      const response = await axiosInstance.get("/auth/logout");

      if (response.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileClick = async () => {
    router.push(`/${user?.username}`);
  };

  useEffect(() => {
    handleOnChange();
  }, [inputText]);

  return (
    <div className="flex justify-center bg-[#060606] sticky top-0 z-50">
      <header className="bg-[#15121F] border-b-[2px] border-[#0D0D0D] pr-[20px] h-[46px] flex items-center justify-between w-full max-w-[928px] ">
        <div className="flex items-center h-full pl-[20px] w-[200px] border-r-[2px]  border-[#0D0D0D]">
          <Image
            alt="profile"
            src={`data:image/png;base64,${user?.avatarBase64}`}
            width={30}
            height={30}
            className="rounded-full"
            onClick={handleProfileClick}
            style={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
          <p
            className="text-white ml-[10px] text-[18px] cursor-pointer"
            onClick={handleProfileClick}
          >
            Profile
          </p>
          <div onClick={handleLogoutClick} className="cursor-pointer">
            <Image
              alt="logout"
              src={LogOut}
              width={22}
              height={22}
              className="ml-[25px]"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#C084FC] text-center flex-1">
          Social Network
        </h1>

        <div className="w-[300px] relative">
          <div className="w-full h-[30px] bg-[#2E2E2E] rounded-[2px] flex items-center overflow-hidden focus-within:ring-2 focus-within:ring-purple-600">
            <div className="flex items-center px-2 border-r-[2px] border-black ">
              <Image
                alt="search"
                src={SearchIcon}
                width={18}
                height={18}
                style={{ width: "18px", height: "18px" }}
              />
            </div>
            <input
              type="text"
              className="flex-1 h-full px-3 text-[#828282] bg-transparent border-none focus:outline-none"
              placeholder="search"
              onChange={(e) => setInputText(e.target.value)}
              onClick={handleInputClick}
            />
          </div>
          {isOpen && <SearchUsersPanel />}
        </div>
      </header>
    </div>
  );
}

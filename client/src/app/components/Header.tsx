"use client";

import { useEffect, useState } from "react";
import profileEmpty from "../images/profileEmpty.png";
import LogOut from "../images/LogOut.svg";

import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  openModal,
  closeModal,
  setSearchQuery,
} from "../store/slices/modalSlice";

export default function Header() {
  const [inputText, setInputText] = useState<string>("");

  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const dispatch = useAppDispatch();

  const handleInputClick = () => {
    isOpen ? dispatch(closeModal()) : dispatch(openModal());
  };

  const handleOnChange = () => {
    dispatch(setSearchQuery(inputText));
  };

  useEffect(() => {
    handleOnChange();
  }, [inputText]);

  return (
    <div className="flex justify-center bg-[#060606] sticky top-0 z-50">
      <header className="bg-[#15121F] border-b-[3px] border-[#0D0D0D] pr-[20px] h-[46px] flex items-center justify-between w-full max-w-[910px] rounded-md">
        {/* Левая часть — профиль */}
        <div className="flex items-center h-full pl-[20px]  w-[182px]   border-r-[3px] border-[#0D0D0D]">
          <Image
            alt="profile"
            src={profileEmpty}
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="text-white ml-[10px] text-[18px]">Profile</p>
          <Image
            alt="logout"
            src={LogOut}
            width={22}
            height={22}
            className="ml-[25px]"
          />
        </div>

        {/* Центр — заголовок */}
        <h1 className="text-2xl font-bold text-[#C084FC] text-center flex-1">
          Social Network
        </h1>

        {/* Правая часть — поиск */}
        <div className="w-[300px]">
          <input
            type="text"
            className="w-full h-[30px] px-4 text-[#828282] bg-[#2E2E2E] border-none rounded-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search"
            onChange={(e) => setInputText(e.target.value)}
            onClick={handleInputClick}
          />
        </div>
      </header>
    </div>
  );
}

"use client";

import axios from "axios";
import Image from "next/image";
import AsideInfo from "../../../components/asideInfo";
import React, { useEffect, useState } from "react";

export default function page() {
  type User = {
    user_id: number | null;
    fullname: string | null;
    username: string | null;
    email: string | null;
    phone: string | null;
    subscribers: number | null;
    subscriptions: number | null;
    description: string | null;
    avatarPathTo: string | null;
  };

  const API = process.env.NEXT_PUBLIC_API_URL;
  const [user, setUser] = useState<User>();
  const [changedUser, setChangedUser] = useState<User>({
    user_id: null,
    fullname: "",
    username: "",
    email: "",
    phone: "",
    description: "",
    avatarPathTo: "",
    subscribers: null,
    subscriptions: null,
  });

  const checkToken = async () => {
    try {
      const res = await axios.get(`${API}/auth/profile`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...changedUser, [name]: value });
  };

  useEffect(() => {
    checkToken();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.patch(`${API}/user/update/${user?.user_id}`, {
        withCredentials: true,
        changedUser,
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  if (!user) {
    return;
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4 ">
      <div className="w-[182px] bg-[#15121F] ">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] pt-[35px] px-[20px]">
        <div className="flex items-center rounded-[2px] bg-[#292929] w-full h-[104px] py-[17px] pl-[7px] font-[Manrope]">
          <Image
            className="w-[70px] h-[70px] rounded-full object-fit "
            src={`data:image/png;base64,${user.avatarPathTo}`}
            alt="Google"
            width={70}
            height={70}
          />
          <p className="text-[20px] ml-[20px]">{user?.fullname}</p>
          <button className="w-[110px] h-[34px] ml-auto mr-[25px] rounded-[2px] bg-[#5020A1]">
            Edit Photo
          </button>
        </div>

        <form
          className="bg-[#292929] box-border font-[Manrope] flex flex-col mt-[5px] rounded-[2px] w-full max-w-[690px] py-[10px] pl-[10px] pr-[25px] text-white"
          onSubmit={handleSubmit}
        >
          <p className="text-[16px]  mb-4">Account details</p>

          <label className="mb-2 text-sm" htmlFor="description">
            About myself
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={200}
            placeholder={user?.description || "Description"}
            className="bg-[#1D1D1D] text-white px-[5px] py-[5px] w-full mb-4 rounded-[2px] resize-none h-[66px]"
          />

          <label className="mb-1 text-sm" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder={user?.username || "Username"}
            className="bg-[#1D1D1D] text-white px-[5px] py-2 mb-4 rounded-[2px] h-[35px] w-full"
          />

          <label className="mb-1 text-sm" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            name="phone"
            placeholder={user?.phone || "Phone"}
            className="bg-[#1D1D1D] text-white px-[5px] py-2 mb-4 rounded-[2px] h-[35px] w-full"
          />

          <label className="mb-1 text-sm" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="text"
            name="email"
            placeholder={user?.email || "Email"}
            className="bg-[#1D1D1D] text-white px-[5px] py-2 mb-4 rounded-[2px] h-[35px] w-full"
          />

          <button
            type="submit"
            className="bg-[#5020A1] text-white px-[26px] py-[6px] mt-4   self-end rounded-md hover:bg-purple-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

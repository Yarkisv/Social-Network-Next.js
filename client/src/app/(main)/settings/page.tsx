"use client";

import axios from "axios";
import Image from "next/image";
import AsideInfo from "../../components/asideInfo";
import React, { useEffect, useState } from "react";
import { User } from "@/app/types/user.type";

export default function page() {
  // type User = {
  //   user_id: number;
  //   fullname: string;
  //   username: string;
  //   email: string;
  //   phone: string;
  //   subscribers: number;
  //   subscriptions: number;
  //   description: string;
  //   avatarPathTo: string;
  // };

  type UpdatedUser = {
    fullname: string | undefined;
    username: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    description: string | undefined;
    file: File | undefined;
  };

  const API = process.env.NEXT_PUBLIC_API_URL;
  const [user, setUser] = useState<User>();

  const [changedUser, setChangedUser] = useState<UpdatedUser>({
    fullname: undefined,
    username: undefined,
    phone: undefined,
    email: undefined,
    description: undefined,
    file: undefined,
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setChangedUser({ ...changedUser, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setChangedUser((prev) => ({ ...prev, file }));
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    console.log(changedUser);
  }, [changedUser]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const id = user?.user_id;

      console.log("Submitting update for user:", id, changedUser);

      const res = await axios.patch(`${API}/user/update/${id}`, changedUser, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", res.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4">
      <div className="w-[200px] rounded-[2px] bg-[#15121F]">
        <AsideInfo />
      </div>

      <div className="w-full max-w-[730px] pt-[10px] pl-[10px]">
        <div className="flex items-center rounded-[2px] bg-[#292929] w-full h-[104px] py-[17px] px-4 font-[Manrope]">
          <Image
            className="w-[70px] h-[70px] rounded-full object-cover"
            src={`data:image/png;base64,${user.avatarBase64}`}
            alt="Avatar"
            width={70}
            height={70}
          />
          <p className="text-[20px] ml-[20px]">{user?.fullname}</p>

          <input type="file" id="file" hidden onChange={handleFileChange} />
          <label
            htmlFor="file"
            className="ml-auto self-center bg-[#5020A1] text-white px-[26px] py-[6px] rounded-md hover:bg-purple-700 transition cursor-pointer"
          >
            Upload
          </label>
        </div>

        <form
          className="bg-[#292929] box-border font-[Manrope] flex flex-col mt-[5px] rounded-[2px] w-full  py-[10px] pl-[10px] pr-[25px] text-white"
          onSubmit={handleSubmit}
        >
          <p className="text-[16px] mb-4">Account details</p>

          <label className="mb-2 text-sm" htmlFor="description">
            About myself
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={200}
            placeholder={user?.description || "Description"}
            className="bg-[#1D1D1D] text-white px-[5px] py-[5px] w-full mb-4 rounded-[2px] resize-none h-[66px]"
            value={changedUser.description ?? ""}
            onChange={handleChange}
          />

          <label className="mb-1 text-sm" htmlFor="fullname">
            Fullname
          </label>
          <input
            id="fullname"
            type="text"
            name="fullname"
            placeholder={user?.fullname || "Fullname"}
            className="bg-[#1D1D1D] text-white px-[5px] py-2 mb-4 rounded-[2px] h-[35px] w-full"
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-[#5020A1] text-white px-[26px] py-[6px] mt-4 self-end rounded-md hover:bg-purple-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

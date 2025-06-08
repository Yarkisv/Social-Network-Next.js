"use client";

import React, { useState } from "react";
import Link from "next/link";
import logoAuth from "../../images/logoAuth.svg";
import Image from "next/image";
import axios from "axios";
import { redirect } from "next/navigation";
import { GrFormView, GrHide } from "react-icons/gr";

export default function RegisterPage() {
  interface IUser {
    fullname: string;
    username: string;
    email: string;
    phone: string;
    password: string;
  }

  const [user, setUser] = useState<IUser>({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log(user);

    const response = await axios.post(`${API}/user/register`, user);

    if (response.status === 201) {
      setUser({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
      });
      redirect("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <Image
        src={logoAuth}
        alt="Auth Logo Background"
        width={334}
        height={313}
        className="absolute z-0  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        priority
      />
      <div
        className="relative z-10 backdrop-blur-[15px] font-light bg-[#15121F]/60 px-[30px] py-[15px] rounded-[2px] w-full max-w-[350px]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-light mb-[24px] text-center text-gray-200">
            Register
          </h2>

          <input
            name="fullname"
            placeholder="Full name"
            value={user.fullname}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border-none bg-[#0D0D0D]/90 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-white  text-white"
          />

          <input
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border-none bg-[#0D0D0D]/90 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-white  text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border-none bg-[#0D0D0D]/90 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-white  text-white"
          />

          <input
            name="phone"
            placeholder="Phone number"
            value={user.phone}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border-none bg-[#0D0D0D]/90 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-white  text-white"
          />

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="true"
              required
              className="w-full px-4 py-2 border-none rounded-[2px] focus:outline-none focus:ring-2 focus:ring-white bg-[#0D0D0D]/90 text-white"
            />
            <button
              className="absolute right-3 cursor-pointer top-[12px] text-white"
              onClick={(e) => {
                e.preventDefault();
                setIsPasswordVisible(!isPasswordVisible);
              }}
            >
              {!isPasswordVisible ? <GrFormView /> : <GrHide />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#3C1D70]/80 text-white py-[5px] rounded-[2px] hover:bg-[#3C1D70] transition duration-300 "
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-white hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}

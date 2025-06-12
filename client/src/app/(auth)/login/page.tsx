"use client";

import React, { useState } from "react";
import logoAuth from "../../images/logoAuth.svg";
import facebok from "../../images/facebok.svg";
import google from "../../images/google.svg";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import axios from "axios";
import { GrFormView, GrHide } from "react-icons/gr";

export default function LoginPage() {
  interface IUser {
    email: string;
    password: string;
  }

  const [user, setUser] = useState<IUser>({
    email: "",
    password: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await axios.post(`${API}/auth/login`, user, {
      withCredentials: true,
    });

    if (response.status === 200) {
      const access_token = await response.data.access_token;
      const refresh_token = await response.data.refresh_token;

      redirect("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060606] relative overflow-hidden">
      <Image
        src={logoAuth}
        alt="Auth Logo Background"
        width={334}
        height={313}
        className="absolute z-0  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        priority
      />
      <div
        className="relative z-10 backdrop-blur-[15px] font-light bg-[#15121F]/60 px-[30px] py-[15px] rounded-[2px] w-full max-w-[350px] h-[434px]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-light mb-[24px] text-center text-gray-200 ">
            Login
          </h2>

          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
            required
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

          <div className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={isRememberMe}
              onChange={() => setIsRememberMe(!isRememberMe)}
              className="w-[20px] h-[20px] cursor-pointer appearance-none bg-[#0D0D0D]/90 border-none  rounded-[2px] checked:bg-white  transition-colors"
            />

            <label>Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#3C1D70]/80 text-white py-[5px] rounded-[2px] hover:bg-[#3C1D70] transition duration-300 "
          >
            Login
          </button>
        </form>
        <div className="mt-4">
          <div className="flex items-center text-white opacity-60 text-sm mb-3">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="px-2">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          <div className="flex justify-center gap-6 mb-3">
            <button className="w-[40px] h-[40px] ">
              <Image src={google} alt="Google" width={40} height={40} />
            </button>
            <button className="w-[40px] h-[40px] ">
              <Image src={facebok} alt="Facebook" width={40} height={40} />
            </button>
          </div>

          <div className="text-center text-xs text-white opacity-50 mb-2">
            <p className="hover:underline cursor-pointer">
              Forgot your password?
            </p>
          </div>
        </div>

        <div className="mt-4 text-center cursor-pointer">
          <Link href="/register" className="text-white hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

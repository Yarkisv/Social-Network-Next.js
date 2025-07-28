"use client";

import React, { useState } from "react";
import facebok from "../../images/facebok.svg";
import google from "../../images/google.svg";
import Image from "next/image";
import Link from "next/link";
import Cubes from "../../components/cubes";
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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

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
      redirect("/");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#060606]/90 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-80 bg-[#0D0D0D] pointer-events-none">
        <Cubes
          gridSize={11}
          maxAngle={125}
          radius={4}
          borderStyle="1px solid #fff"
          faceColor="#000000ff"
          rippleColor="fff"
          rippleSpeed={2}
          autoAnimate={true}
          rippleOnClick={true}
        />
      </div>

      <div className="relative z-10 backdrop-blur-[15px] font-light bg-[#15121F]/60 px-[36px] py-[24px] rounded-md w-full max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl font-light mb-[16px] text-center text-gray-200">
            Welcome back
          </h2>

          <div>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-sm text-gray-400 mt-1">
              Enter your registered email
            </p>
          </div>

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              required
              autoComplete="true"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
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
            <p className="text-sm text-gray-400 mt-1">
              Use your account password
            </p>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={isRememberMe}
              onChange={() => setIsRememberMe(!isRememberMe)}
              className="w-[18px] h-[18px] rounded-sm bg-[#0D0D0D]/90 border-none checked:bg-white transition-colors cursor-pointer"
            />
            <label className="text-sm select-none">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#3C1D70]/70 text-white py-2.5 rounded-md hover:bg-purple-900 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <div className="flex items-center text-white opacity-60 text-sm mb-3">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="px-2">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          <div className="flex justify-center gap-6 mb-4">
            <button className="w-[40px] h-[40px]">
              <Image src={google} alt="Google" width={40} height={40} />
            </button>
            <button className="w-[40px] h-[40px]">
              <Image src={facebok} alt="Facebook" width={40} height={40} />
            </button>
          </div>

          <div className="text-center text-sm text-white opacity-50 mb-3">
            <p className="hover:underline cursor-pointer">
              Forgot your password?
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-white mt-4">
          <Link href="/register" className="hover:underline">
            Don’t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

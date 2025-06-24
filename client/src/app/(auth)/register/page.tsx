"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { redirect } from "next/navigation";
import { GrFormView, GrHide } from "react-icons/gr";
import Cubes from "../../components/cubes";

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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="relative min-h-screen flex items-center justify-center bg-[#060606]/90 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-80 bg-[#0D0D0D] pointer-events-none">
        <Cubes
          gridSize={11}
          maxAngle={125}
          radius={4}
          borderStyle="1px solid #fff"
          faceColor="#060010"
          rippleColor="fff"
          rippleSpeed={2}
          autoAnimate={true}
          rippleOnClick={true}
        />
      </div>

      <div className="z-10 backdrop-blur-[15px] font-light bg-[#15121F]/60 px-[36px] py-[24px] rounded-md w-full max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl font-light mb-[16px] text-center text-gray-200">
            Create your account
          </h2>

          <div>
            <input
              name="fullname"
              placeholder="Full name"
              value={user.fullname}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-sm text-gray-400 mt-1">Your legal full name</p>
          </div>

          <div>
            <input
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-sm text-gray-400 mt-1">
              Unique username to log in
            </p>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-sm text-gray-400 mt-1">
              We’ll never share your email
            </p>
          </div>

          <div>
            <input
              name="phone"
              placeholder="Phone number"
              value={user.phone}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-sm text-gray-400 mt-1">
              Include country code, e.g. +380
            </p>
          </div>

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              className="absolute right-3 cursor-pointer top-3 text-white"
              onClick={(e) => {
                e.preventDefault();
                setIsPasswordVisible((v) => !v);
              }}
            >
              {!isPasswordVisible ? (
                <GrFormView size={20} />
              ) : (
                <GrHide size={20} />
              )}
            </button>
            <p className="text-sm text-gray-400 mt-1">
              Use at least 6 characters
            </p>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#3C1D70]/70 text-white py-2.5 rounded-md hover:bg-purple-900 transition duration-300"
          >
            Register
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/login" className="text-gray-300 hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

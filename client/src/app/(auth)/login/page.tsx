"use client";

import React, { useState } from "react";
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

    const response = await axios.post(`${API}/auth/login`, user);

    if (response.status === 200) {
      const access_token = await response.data.access_token;

      console.log(access_token);

      if (isRememberMe) {
        localStorage.setItem("access_token", access_token);
      } else {
        sessionStorage.setItem("access_token", access_token);
      }

      redirect("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Login
          </h2>

          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="true"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className=""
            onClick={(e) => {
              e.preventDefault();
              setIsPasswordVisible(!isPasswordVisible);
            }}
          >
            {!isPasswordVisible ? <GrFormView /> : <GrHide />}
          </button>

          <div className="">
            <input
              className=""
              type="checkbox"
              checked={isRememberMe}
              onChange={() => setIsRememberMe(!isRememberMe)}
            />
            <label className="">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300 cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/register" className="text-blue-600 hover:underline">
            Don't have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}

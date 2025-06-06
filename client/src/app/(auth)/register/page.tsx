"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Register
          </h2>

          <input
            name="fullname"
            placeholder="Full name"
            value={user.fullname}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="phone"
            placeholder="Phone number"
            value={user.phone}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="show-pass-btn"
            onClick={(e) => {
              e.preventDefault();
              setIsPasswordVisible(!isPasswordVisible);
            }}
          >
            {!isPasswordVisible ? <GrFormView /> : <GrHide />}
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300 cursor-pointer"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}

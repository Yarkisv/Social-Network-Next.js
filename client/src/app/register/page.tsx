"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { redirect } from "next/navigation";

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await axios.post("http://localhost:3000/register", {
      user,
    });

    if (response.status === 200) {
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
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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

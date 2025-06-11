"use client";

import axios from "axios";
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
    <div className="p-6 bg-white rounded-md shadow-md max-w-md mx-auto">
      <div className="flex flex-col space-y-4">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            placeholder={user?.fullname || "Full Name"}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="username"
            placeholder={user?.username || "Username"}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="email"
            placeholder={user?.email || "Email"}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="phone"
            placeholder={user?.phone || "Phone"}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="description"
            placeholder={user?.description || "Description"}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit">Confirm</button>
        </form>
      </div>
    </div>
  );
}

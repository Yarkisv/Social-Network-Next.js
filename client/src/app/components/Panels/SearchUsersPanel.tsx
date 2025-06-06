"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { closeModal } from "@/app/store/modal/modalSlice";

type User = {
  fullname: string;
  username: string;
  email: string;
  phone: string;
};

export default function SearchUsersPanel() {
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const searchQuery = useAppSelector((state) => state.modal.searchQuery);

  const [users, setUsers] = useState<User[]>([]);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const dispatch = useAppDispatch();

  const handleClosePanel = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!searchQuery) {
        setUsers([]);
        return;
      }

      try {
        const res = await axios.get(`${API}/user/usernames/${searchQuery}`);

        setUsers(await res.data);
      } catch (error) {
        setUsers([]);
        console.log("Error: ", error);
      }
    };

    fetchUser();
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center z-10 justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
        <h2 className="text-xl font-semibold mb-4">Результаты поиска</h2>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.username}
                className="p-3 border rounded hover:bg-gray-50"
              >
                <p className="font-medium">{user.fullname}</p>
                <p className="text-gray-500 text-sm">@{user.username}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Пользователи не найдены</p>
          )}
        </div>

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={handleClosePanel}
        >
          ×
        </button>
      </div>
    </div>
  );
}

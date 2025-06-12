"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { closeModal } from "@/app/store/slices/modalSlice";

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
  const panelRef = useRef<HTMLDivElement>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useAppDispatch();

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        dispatch(closeModal());
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(closeModal());
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dispatch]);

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
  }, [searchQuery, API]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-[40px] right-0 z-50 w-[300px]" ref={panelRef}>
      <div className="bg-[#15121F] text-white border border-[#0D0D0D] rounded-md shadow-md p-4 relative">
        <h2 className="text-md font-semibold mb-2">Search results</h2>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.username}
                className="p-2 border border-[#2E2E2E] rounded hover:bg-[#2E2E2E] transition"
              >
                <p className="font-medium">{user.fullname}</p>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">Users not found</p>
          )}
        </div>

        <button
          className="absolute top-1 right-2 text-gray-400 hover:text-white text-xl"
          onClick={() => dispatch(closeModal())}
        >
          ×
        </button>
      </div>
    </div>
  );
}

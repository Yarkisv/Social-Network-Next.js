"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import axios from "axios";
import { PendingSub } from "@/app/types/pending-sub.type";

type PendingSubsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PendingSubscribersModal({
  isOpen,
  onClose,
}: PendingSubsModalProps) {
  const [pendingSubs, setPendingSubs] = useState<PendingSub[]>([]);

  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;

  const fetchPending = async () => {
    try {
      const response = await axiosInstance.get("/subscription/pending");

      setPendingSubs(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onAccept = async (subscription_id: number) => {
    try {
      await axiosInstance.patch(
        `subscription/update-status/${subscription_id}`,
      );

      fetchPending();
    } catch (error) {
      console.log(error);
    }
  };

  const onReject = async (subscription_id: number) => {
    try {
      await axiosInstance.delete(`subscription/delete-sub/${subscription_id}`);

      fetchPending();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#121212] border border-[#2a2a2a] rounded-2xl shadow-xl flex flex-col max-h-[80vh]">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-white text-lg font-semibold">Pending requests</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* list */}
        <div className="overflow-y-auto px-5 py-3 flex flex-col gap-3">
          {pendingSubs?.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-6">
              Немає запитів
            </p>
          )}

          {pendingSubs?.map((item) => (
            <div
              key={item.subscription_id}
              className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-xl border border-[#2a2a2a]"
            >
              {/* user info */}
              <div className="flex items-center gap-3">
                <img
                  src={`http://localhost:4000/static/${item.avatarPathTo}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    {item.fullname}
                  </span>
                  <span className="text-gray-500 text-xs">
                    @{item.username}
                  </span>
                </div>
              </div>

              {/* actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onAccept(item.subscription_id)}
                  className="px-3 py-1 text-xs rounded-lg bg-green-600 hover:bg-green-500 text-white transition"
                >
                  Прийняти
                </button>

                <button
                  onClick={() => onReject(item.subscription_id)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
                >
                  Відхилити
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

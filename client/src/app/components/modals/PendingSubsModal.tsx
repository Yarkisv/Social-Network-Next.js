"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { PendingSub } from "@/app/types/pending-sub.type";
import Image from "next/image";
import cancel_upload from "../../images/cancel_upload.svg";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/60 px-4">
      <div className="flex font-[Space_Grotesk] relative flex-col h-[440px] w-[400px] text-white bg-[#292929] rounded-[2px] pt-[15px] pb-[20px] px-[20px] overflow-hidden">
        <Image
          onClick={onClose}
          src={cancel_upload}
          alt="close"
          className="absolute top-[10px] right-[10px] cursor-pointer"
        />

        <h2 className="text-[20px] text-center mb-6">Pending subscriptions</h2>

        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
          {pendingSubs?.length === 0 && (
            <p className="text-[#BABABA] text-sm text-center mt-10 font-light">
              No pending requests
            </p>
          )}

          {pendingSubs?.map((item) => (
            <div
              key={item.subscription_id}
              className="flex items-center justify-between bg-[#1E1E1E] border border-[#2F2B3A] rounded-[2px] px-3 py-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`${STATIC_API}/${item.avatarPathTo}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    {item.fullname}
                  </span>

                  <span className="text-[#BABABA] text-xs font-light">
                    @{item.username}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onAccept(item.subscription_id)}
                  className="bg-[#5020A1] hover:bg-purple-700 transition text-white px-3 py-1 rounded-[2px] text-xs cursor-pointer"
                >
                  Accept
                </button>

                <button
                  onClick={() => onReject(item.subscription_id)}
                  className="bg-[#3A3A3A] hover:bg-[#4A4A4A] transition text-white px-3 py-1 rounded-[2px] text-xs cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

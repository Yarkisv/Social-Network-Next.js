import React from "react";
import { Subs } from "@/app/types/subs.type";
import cancel_upload from "../../images/cancel_upload.svg";

import Image from "next/image";

type SubsModalProps = {
  subs: Subs[];
  isOpen: boolean;
  onClose: () => void;
};

export default function SubscriptionsModal({
  subs,
  isOpen,
  onClose,
}: SubsModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#15121F] text-white border border-[#0D0D0D] p-6 rounded-md shadow-md w-[400px] max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>
        <Image
          onClick={onClose}
          src={cancel_upload}
          alt="Avatar"
          className="absolute top-[10px] right-[10px] "
        />
        <ul className="space-y-3">
          {subs.map((sub) => (
            <li
              key={sub.user_id}
              className="flex items-center p-2 rounded-[2px] hover:bg-[#2E2E2E] transition cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#333] flex items-center justify-center">
                  <Image
                    src={`data:image/png;base64,${sub.imageBase64}`}
                    alt="avatar"
                    height={48}
                    width={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="font-medium text-sm">{sub.fullname}</div>
              </div>
              <div className="ml-auto">
                <button className="rounded-[2px] bg-[#5020A1] hover:bg-[#3B1678] h-[30px] cursor-pointer text-white text-center px-[14px] font-[inter] font-extralight">
                  subscribe
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

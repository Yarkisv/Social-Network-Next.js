import React from "react";
import { Subs } from "@/app/types/subs.type";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-500 p-6 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">Subscriptions</h2>

        <ul className="space-y-3">
          {subs.map((sub) => (
            <li key={sub.user_id} className="flex items-center gap-3">
              <Image
                src={`data:image/png;base64,${sub.imageBase64}`}
                alt="avatar"
                height={50}
                width={50}
                className="w-28 h-28 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-black">{sub.username}</div>
                <div className="font-medium text-black">{sub.fullname}</div>
              </div>
            </li>
          ))}
        </ul>

        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

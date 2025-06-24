import React from "react";
import { Subs } from "@/app/types/subs.type";

type SubsModalProps = {
  subs: Subs[];
  isOpen: boolean;
  onClose: () => void;
};

export default function SubscribersModal({
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
        <h2 className="text-xl font-semibold mb-4 text-black">Subscribers</h2>

        <ul className="space-y-3">
          {subs.length > 0 ? (
            subs.map((sub) => (
              <li key={sub.user_id} className="flex items-center gap-3">
                <img
                  src={`data:image/png;base64,${sub.imageBase64}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{sub.fullname}</div>
                  <div></div>
                </div>
              </li>
            ))
          ) : (
            <div>
              <p className="text-black">0 subscribers</p>
            </div>
          )}
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

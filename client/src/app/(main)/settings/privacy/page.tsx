"use client";

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export default function PrivacySettingsPage() {
  const [isPrivate, setIsPrivate] = useState<null | boolean>(null);

  const fetchUserPrivacy = async () => {
    try {
      const response = await axiosInstance.get("user/privacy");

      setIsPrivate(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTogglePrivacy = async () => {
    setIsPrivate(!isPrivate);

    try {
      await axiosInstance.patch("user/privacy");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserPrivacy();
  }, []);

  if (isPrivate === null) return <div>Pending</div>;

  return (
    <div className="h-[calc(100vh-46px)] bg-[#0b0b0b] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#121212] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
        <h1 className="text-white text-2xl font-semibold mb-2">
          Налаштування приватності
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          Коли акаунт приватний, тільки підписники можуть бачити ваші пости.
        </p>

        <div className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-xl mb-6">
          <span className="text-white">Приватний акаунт</span>

          <button
            onClick={handleTogglePrivacy}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isPrivate ? "bg-blue-500" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isPrivate ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Ви можете змінити це налаштування у будь-який час
        </p>
      </div>
    </div>
  );
}

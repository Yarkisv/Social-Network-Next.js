"use client";

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export default function PrivacySettingsPage() {
  const [isPrivate, setIsPrivate] = useState<boolean | null>(null);

  const fetchUserPrivacy = async () => {
    try {
      const response = await axiosInstance.get("/user/privacy");

      setIsPrivate(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTogglePrivacy = async () => {
    const newValue = !isPrivate;

    setIsPrivate(newValue);

    try {
      await axiosInstance.patch("/user/privacy");
    } catch (error) {
      console.log(error);

      // rollback якщо помилка
      setIsPrivate(!newValue);
    }
  };

  useEffect(() => {
    fetchUserPrivacy();
  }, []);

  if (isPrivate === null) {
    return (
      <div className="h-[calc(100vh-46px)] w-full max-w-[730px] pt-[10px] pl-[10px] text-white font-[Manrope]">
        Завантаження...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-46px)] w-full max-w-[730px] pt-[10px] pl-[10px]">
      <div className="bg-[#292929] rounded-[2px] w-full px-[10px] py-[15px] font-[Manrope] text-white">
        <p className="text-[16px] mb-4">Налаштування приватності</p>

        <div className="bg-[#1D1D1D] rounded-[2px] px-[12px] py-[14px] flex items-center justify-between">
          <div>
            <p className="text-[15px]">Приватний акаунт</p>

            <p className="text-[12px] text-gray-400 mt-[4px] max-w-[430px]">
              Коли акаунт приватний, тільки підписники можуть бачити ваші пости
              та інформацію профілю.
            </p>
          </div>

          <button
            onClick={handleTogglePrivacy}
            className={`w-[50px] h-[28px] rounded-full flex items-center px-[3px] transition-all duration-300 cursor-pointer ${
              isPrivate ? "bg-[#5020A1]" : "bg-[#555]"
            }`}
          >
            <div
              className={`w-[22px] h-[22px] bg-white rounded-full transition-all duration-300 ${
                isPrivate ? "translate-x-[22px]" : ""
              }`}
            />
          </button>
        </div>

        <p className="text-[12px] text-gray-500 mt-4">
          Ви можете змінити це налаштування у будь-який час.
        </p>
      </div>
    </div>
  );
}

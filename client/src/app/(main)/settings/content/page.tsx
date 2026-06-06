"use client";

import axiosInstance from "@/lib/axios";
import React, { useEffect, useState } from "react";

const ALL_INTERESTS = [
  "dota2",
  "f1",
  "cars",
  "audi",
  "gaming",
  "esports",
  "football",
  "technology",
  "music",
  "movies",
];

export default function RecommendationSettingsPage() {
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const fetchUserInterests = async () => {
    const response = await axiosInstance.get("user/get-interests");

    setInterests(response.data);
  };

  const sendNewInteres = async () => {
    await axiosInstance.patch("user/interests", {
      interests: [...interests, customInterest],
    });

    fetchUserInterests();
  };

  const clearInterests = async () => {
    try {
      await axiosInstance.patch("user/clear-interests");

      fetchUserInterests();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserInterests();
  }, []);

  return (
    <div className="h-[calc(100vh-46px)] w-full max-w-[730px] pt-[10px] pl-[10px]">
      <div className="bg-[#292929] rounded-[2px] p-[20px] text-white font-[Manrope]">
        <h1 className="text-[20px] mb-[4px]">Налаштування рекомендацій</h1>

        <p className="text-[#A1A1A1] text-[14px] mb-[20px]">
          Оберіть який контент вам рекомендувати
        </p>

        <div className="bg-[#1D1D1D] p-[15px] rounded-[2px] mb-[15px]">
          <h2 className="text-[16px] mb-[12px]">Ваші інтереси</h2>

          <div className="flex flex-wrap gap-[8px]">
            {interests.length === 0 && (
              <p className="text-[#7A7A7A] text-[14px]">Інтереси не вибрано</p>
            )}

            {interests.map((item) => (
              <span
                key={item}
                className="
                bg-[#5020A1]
                px-[12px]
                py-[5px]
                rounded-[2px]
                text-[14px]
                cursor-pointer
                hover:bg-purple-700
                transition
              "
                onClick={() => toggleInterest(item)}
              >
                {item} ✕
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#1D1D1D] p-[15px] rounded-[2px] mb-[15px]">
          <h2 className="text-[16px] mb-[12px]">Додати новий інтерес</h2>

          <div className="flex gap-[10px]">
            <input
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Ваш інтерес"
              className="
              flex-1
              h-[35px]
              bg-[#121212]
              text-white
              px-[10px]
              rounded-[2px]
              outline-none
            "
            />

            <button
              className="
              bg-[#5020A1]
              px-[20px]
              rounded-md
              hover:bg-purple-700
              transition
            "
              onClick={sendNewInteres}
            >
              Додати
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={clearInterests}
            className="
            text-red-400
            hover:text-red-300
            transition
          "
          >
            Видалити інтереси
          </button>

          <button
            className="
            bg-[#5020A1]
            px-[26px]
            py-[6px]
            rounded-md
            hover:bg-purple-700
            transition
          "
          >
            Зберегти зміни
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <div className="h-[calc(100vh-46px)] bg-[#121212] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Налаштування рекомендацій</h1>
        <p className="text-gray-400 mb-6">
          Оберіть який контент вам рекомендувати
        </p>

        <div className="bg-[#1f1f1f] p-4 rounded-xl mb-6">
          <h2 className="font-semibold mb-3">Ваші інтереси</h2>

          <div className="flex flex-wrap gap-2">
            {interests.length === 0 && (
              <p className="text-gray-500 text-sm">No interests selected</p>
            )}

            {interests.map((item) => (
              <span
                key={item}
                className="bg-purple-600 px-3 py-1 rounded-full text-sm cursor-pointer"
                onClick={() => toggleInterest(item)}
              >
                {item} ✕
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#1f1f1f] p-4 rounded-xl mb-6">
          <h2 className="font-semibold mb-3">Додати власний інтерес</h2>

          <div className="flex gap-2">
            <input
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Ваші інтереси"
              className="flex-1 px-3 py-2 rounded-lg bg-[#2a2a2a] text-white outline-none border border-gray-600 focus:border-purple-500"
            />

            <button
              className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500"
              onClick={sendNewInteres}
            >
              Додати
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={clearInterests}
            className="text-red-400 hover:text-red-300"
          >
            Видалили інтереси
          </button>

          <button className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-500">
            Зберегти зміни
          </button>
        </div>
      </div>
    </div>
  );
}

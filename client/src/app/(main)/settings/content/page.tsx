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

  const resetInterests = () => {
    setInterests([]);
  };

  const fetchUserInterests = async () => {
    const response = await axiosInstance.get("user/get-interests");

    setInterests(response.data);
  };

  const sendNewInteres = async () => {
    const response = await axiosInstance.patch("user/interests", {
      interests: [...interests, customInterest],
    });

    fetchUserInterests();
  };

  useEffect(() => {
    fetchUserInterests();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Recommendation Settings</h1>
        <p className="text-gray-400 mb-6">
          Choose what content should appear in your feed
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

        {/* <div className="bg-[#1f1f1f] p-4 rounded-xl mb-6">
          <h2 className="font-semibold mb-3">Recommended topics</h2>

          <div className="flex flex-wrap gap-2">
            {ALL_INTERESTS.map((item) => {
              const active = interests.includes(item);

              return (
                <button
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    active
                      ? "bg-purple-600 border-purple-600"
                      : "border-gray-600 text-gray-300"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div> */}

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={resetInterests}
            className="text-red-400 hover:text-red-300"
          >
            Reset interests
          </button>

          <button className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-500">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

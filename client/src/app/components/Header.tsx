"use client";

import { useState } from "react";

export default function Header() {
  const [inputText, setInputText] = useState<string>("");

  const handleInputClick = () => {};

  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-blue-600">Social Network</h1>

      <input
        type="text"
        className="w-[300px] h-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search"
        onClick={handleInputClick}
      />
    </header>
  );
}

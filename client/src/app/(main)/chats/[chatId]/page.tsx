import AsideInfo from "@/app/components/asideInfo";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4">
      <div className="w-[198px] bg-[#15121F]">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] flex flex-col p-5 font-[Manrope] bg-[#111] rounded-2xl border border-[#2a2a2a]">
        <header className="flex items-center border-b border-[#2f2f2f] pb-3 mb-4">
          <img
            src="/team-avatar.png"
            alt="Chat avatar"
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <h2 className="text-xl font-semibold text-white">Web Dev Team</h2>
        </header>

        <section className="flex-1 overflow-y-auto flex flex-col gap-3 bg-[#0d0d0d] p-4 rounded-xl h-[400px]">
          <div className="self-start bg-[#1f1f1f] px-4 py-3 rounded-xl max-w-[75%]">
            <p className="text-sm text-white">Hello! 👋</p>
            <span className="block mt-1 text-xs text-gray-400">10:00</span>
          </div>
          <div className="self-end bg-[#7e22ce] px-4 py-3 rounded-xl max-w-[75%] text-white">
            <p className="text-sm">Hi! Ready to code?</p>
            <span className="block mt-1 text-xs text-gray-300">10:01</span>
          </div>
          <div className="self-start bg-[#1f1f1f] px-4 py-3 rounded-xl max-w-[75%]">
            <p className="text-sm text-white">Always 😎</p>
            <span className="block mt-1 text-xs text-gray-400">10:02</span>
          </div>
        </section>

        <footer className="flex items-end gap-3 mt-4">
          <textarea
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-[#333] outline-none"
          />
          <button className="bg-[#9333EA] hover:bg-[#7e22ce] px-5 py-3 rounded-xl text-white font-semibold">
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}

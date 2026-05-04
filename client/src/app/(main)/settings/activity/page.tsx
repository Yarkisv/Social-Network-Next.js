"use client";

import { useRouter } from "next/navigation";

export default function ActivityPage() {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-46px)] w-full max-w-[730px] pt-[10px] pl-[10px] font-[Manrope] text-white">
      {/* Header */}
      <div className="bg-[#292929] rounded-[2px] px-4 py-[17px] mb-[5px]">
        <p className="text-[20px]">Ваша активність</p>
      </div>

      <div className="bg-[#292929] rounded-[2px] px-[15px] py-[15px] flex flex-col gap-[15px]">
        <p className="text-[16px] text-gray-300">Дії</p>

        <div
          className="cursor-pointer hover:text-white text-gray-400 transition"
          onClick={() => router.push("/settings/activity/likes")}
        >
          Лайки
        </div>

        <div
          className="cursor-pointer hover:text-white text-gray-400 transition"
          onClick={() => router.push("/settings/activity/comments")}
        >
          Коментарі
        </div>

        <div
          className="cursor-pointer hover:text-white text-gray-400 transition"
          onClick={() => router.push("/settings/activity/saved")}
        >
          Збережені
        </div>

        <div className="border-t border-[#1D1D1D] my-[5px]" />

        <p className="text-[14px] text-gray-500">Поширений вами контент</p>

        <div
          className="cursor-pointer hover:text-white text-gray-400 transition"
          onClick={() => router.push("/settings/activity/posts")}
        >
          Пости
        </div>
      </div>
    </div>
  );
}

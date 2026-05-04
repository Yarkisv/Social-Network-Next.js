"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-46px)] w-full max-w-[730px] pt-[10px] pl-[10px] font-[Manrope] text-white">
      <div className="bg-[#292929] rounded-[2px] px-4 py-[17px] mb-[5px]">
        <p className="text-[20px]">Налаштування</p>
      </div>

      <div className="bg-[#292929] rounded-[2px] px-[15px] py-[15px] flex flex-col gap-[15px]">
        <div
          className="cursor-pointer text-gray-400 hover:text-white transition"
          onClick={() => router.push("/settings/edit-profile")}
        >
          Редагування профіля
        </div>

        <div
          className="cursor-pointer text-gray-400 hover:text-white transition"
          onClick={() => router.push("/settings/privacy")}
        >
          Конфіденційність акаунта
        </div>

        <div
          className="cursor-pointer text-gray-400 hover:text-white transition"
          onClick={() => router.push("/settings/blocked")}
        >
          Заблоковані користувачі
        </div>

        <div
          className="cursor-pointer text-gray-400 hover:text-white transition"
          onClick={() => router.push("/settings/activity")}
        >
          Ваша активність
        </div>

        <div
          className="cursor-pointer text-gray-400 hover:text-white transition"
          onClick={() => router.push("/settings/stats")}
        >
          Ваша статистика
        </div>

        <div
          className="cursor-pointer text-gray-400 hover:text-white transition"
          onClick={() => router.push("/settings/content")}
        >
          Налаштування контента
        </div>
      </div>
    </div>
  );
}

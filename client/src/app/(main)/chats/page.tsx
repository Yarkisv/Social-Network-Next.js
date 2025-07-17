import AsideInfo from "@/app/components/asideInfo";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4">
      <div className="w-[198px] bg-[#15121F]">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] pt-[20px] px-[20px] font-[Manrope]"></div>
    </div>
  );
}

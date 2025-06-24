import AsideInfo from "../components/asideInfo";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4 ">
      <div className="w-[200px] bg-[#15121F] ">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] pt-[35px] pl-[20px]">
        <h1 className="text-white">Main page</h1>
      </div>
    </div>
  );
}

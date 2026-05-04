"use client";

import axiosInstance from "@/lib/axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CommentsPage() {
  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;
  const [comments, setComments] = useState<any[]>([]);

  const fetchAllComments = async () => {
    const response = await axiosInstance.get("comment/all-by-user");

    console.log(response.data);

    setComments(response.data);
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  return (
    <div className="h-[calc(100vh-46px)] w-full max-w-[730px] pt-[10px] pl-[10px] font-[Manrope] text-white">
      <div className="bg-[#292929] rounded-[2px] px-4 py-[17px] mb-[5px]">
        <p className="text-[20px]">Ваші коментарі</p>
      </div>

      <div className="bg-[#292929] rounded-[2px] px-[15px] py-[15px] flex flex-col gap-[15px]">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="flex items-start gap-3 p-2 rounded-[2px] hover:bg-[#1f1f1f] transition cursor-pointer"
            >
              <div className="w-[45px] h-[45px] flex-shrink-0">
                <Image
                  src={`${STATIC_API}/${comment.post.images[0].path_to}`}
                  alt="post"
                  width={45}
                  height={45}
                  className="w-[45px] h-[45px] object-cover rounded-[2px]"
                />
              </div>

              <div className="flex flex-col">
                <p className="text-[14px] text-white">
                  Ви прокоментували пост "{comment.post.post_title}"
                </p>

                <p className="text-[12px] text-gray-400 mt-[2px]">
                  “{comment.content}”
                </p>

                <p className="text-[11px] text-gray-500 mt-[2px]">
                  {new Date(comment.sent_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">У вас ще немає коментарів</div>
        )}
      </div>
    </div>
  );
}

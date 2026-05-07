"use client";

import { Like } from "@/app/types/like.type";
import { Post } from "@/app/types/post.type";
import axiosInstance from "@/lib/axios";

import { useEffect, useState } from "react";

import PostGrid from "@/app/components/PostGrid";

export default function LikesPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchAllUserLikes = async () => {
    const response = await axiosInstance.get("like/get-all");

    const posts = response.data.map((like: Like) => like.post);

    setPosts(posts);
  };

  useEffect(() => {
    fetchAllUserLikes();
  }, []);

  return (
    <div className="h-[calc(100vh-46px)] w-full max-w-[730px] pt-[10px] pl-[10px] font-[Manrope] text-white">
      <div className="bg-[#292929] rounded-[2px] px-4 py-[17px] mb-[5px]">
        <p className="text-[20px]">Ваші лайки</p>
      </div>

      <div className="bg-[#292929] rounded-[2px] px-[15px] py-[15px] flex flex-col gap-[15px]">
        {posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <div className="text-gray-400 text-sm">Немає лайкнутих постів</div>
        )}
      </div>
    </div>
  );
}

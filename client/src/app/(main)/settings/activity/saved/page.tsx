"use client";

import PostGrid from "@/app/components/PostGrid";
import { Post } from "@/app/types/post.type";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export default function SavedPostsPage() {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);

  const fetchSavedPosts = async () => {
    try {
      const response = await axiosInstance.get("saved-posts/get-all");

      setSavedPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  return (
    <div className="h-[calc(100vh-46px)] w-full max-w-[730px] pt-[10px] pl-[10px] font-[Manrope] text-white">
      <div className="bg-[#292929] rounded-[2px] px-4 py-[17px] mb-[5px]">
        <p className="text-[20px]">Збережені вами пости</p>
      </div>

      <div className="bg-[#292929] rounded-[2px] px-[15px] py-[15px] flex flex-col gap-[15px]">
        {savedPosts.length > 0 ? (
          <PostGrid posts={savedPosts} />
        ) : (
          <div className="text-gray-400 text-sm">0 постів</div>
        )}
      </div>
    </div>
  );
}

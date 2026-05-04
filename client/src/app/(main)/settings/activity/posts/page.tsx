"use client";

import { useAppSelector } from "@/app/hooks";
import { Post } from "@/app/types/post.type";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PostsActivityPage() {
  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;
  const user = useAppSelector((state) => state.user.user);

  const [posts, setPosts] = useState<Post[]>([]);

  const fetchAllPosts = async () => {
    const response = await axiosInstance.get("/post/get-all");

    console.log(response.data);

    setPosts(response.data);
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="h-[calc(100vh-46px)] w-full max-w-[730px] pt-[10px] pl-[10px] font-[Manrope] text-white">
      <div className="bg-[#292929] rounded-[2px] px-4 py-[17px] mb-[5px]">
        <p className="text-[20px]">Поширені вами пости</p>
      </div>

      <div className="bg-[#292929] rounded-[2px] px-[15px] py-[15px] flex flex-col gap-[15px]">
        {posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-[5px]">
            {posts.map((post) => (
              <Image
                key={post.post_id}
                src={`${STATIC_API}/${post.images[0].path_to}`}
                alt="post_first_image"
                width={233}
                height={233}
                className="rounded-[2px] object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">0 постів</div>
        )}
      </div>
    </div>
  );
}

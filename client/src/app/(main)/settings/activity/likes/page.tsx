"use client";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Like } from "@/app/types/like.type";
import { Post } from "@/app/types/post.type";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  closePostModalWindow,
  openPostModalWindow,
} from "@/app/store/slices/modalSlice";
import PostModal from "@/app/components/modals/PostModal";

export default function LikesPage() {
  const dispatch = useAppDispatch();
  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;
  const [likes, setLikes] = useState<Like[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>();
  const isPostModalOpen = useAppSelector(
    (state) => state.modal.isPostModalOpen,
  );

  const fetchAllUserLikes = async () => {
    const response = await axiosInstance.get("like/get-all");

    console.log(response.data);

    setLikes(response.data);
  };

  const handlePostModalOpen = (post: Post) => {
    setSelectedPost(post);

    console.log(post);

    dispatch(openPostModalWindow());
  };

  const handlePostModalClose = () => {
    dispatch(closePostModalWindow());
    setSelectedPost(null);
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
        {likes.length > 0 ? (
          <div className="grid grid-cols-3 gap-[5px]">
            {likes.map((like) => (
              <Image
                key={like.post.post_id}
                src={`${STATIC_API}/${like.post.images[0].path_to}`}
                alt="post"
                width={233}
                height={233}
                priority
                onClick={() => handlePostModalOpen(like.post)}
                className="object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">Немає лайкнутих постів</div>
        )}
      </div>
      <PostModal
        post={selectedPost}
        onClose={handlePostModalClose}
        isOpen={isPostModalOpen}
      />
    </div>
  );
}

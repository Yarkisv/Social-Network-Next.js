import { Post } from "@/app/types/post.type";
import React from "react";
import Image from "next/image";

type PostModalProps = {
  post: Post | undefined | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function PostModal({ isOpen, onClose, post }: PostModalProps) {
  if (!isOpen || !post) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
        <button
          className="ml-auto block text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        <Image
          alt="post"
          src={`data:image/png;base64,${post.imageBase64}`}
          height={200}
          width={200}
        ></Image>

        <h2 className="text-xl font-bold text-black">{post.post_title}</h2>
        <p className="text-black">Likes {post.likes}</p>
      </div>
    </div>
  );
}

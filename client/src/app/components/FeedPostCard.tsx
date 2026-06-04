import React from "react";
import { Post } from "../types/post.type";

type Props = {
  post: Post;
  onClick: (post: Post) => void;
};

export const FeedPostCard: React.FC<Props> = ({ post, onClick }) => {
  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;
  const image = post.images?.[0];

  return (
    <div
      className="bg-[#1f1f1f] text-white w-[728px] ml-[-28px] overflow-hidden shadow-md mb-3"
      onClick={() => onClick(post)}
    >
      <div className="flex items-center gap-3 p-4 relative z-10">
        <img
          src={`${STATIC_API}/${post.userAvatar}`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <span className="font-semibold">{post.username}</span>
        </div>
      </div>

      {image && (
        <div className="w-full">
          <img
            src={`${STATIC_API}/${image.path_to}`}
            alt="post"
            className="w-full max-h-[500px] object-cover block"
          />
        </div>
      )}

      <div className="px-4 pb-3">
        <p className="text-sm text-gray-200 leading-relaxed">
          {post.post_title}
        </p>
      </div>
    </div>
  );
};

import React from "react";

type Props = {
  post: {
    post_id: number;
    post_title: string;
    images: {
      id: number;
      path_to: string;
    }[];
    user: {
      user_id: number;
      username: string;
      avatarPathTo: string;
    };
    score: number;
  };
};

export const FeedPostCard: React.FC<Props> = ({ post }) => {
  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;
  const image = post.images?.[0];

  return (
    <div className="bg-[#1f1f1f] text-white rounded-xl overflow-hidden shadow-md mb-6">
      <div className="flex items-center gap-3 p-4">
        <img
          src={`${STATIC_API}/${post.user.avatarPathTo}`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <span className="font-semibold">{post.user.username}</span>
        </div>
      </div>

      <div className="px-4 pb-3">
        <p className="text-sm text-gray-200 leading-relaxed">
          {post.post_title}
        </p>
      </div>

      {image && (
        <div className="w-full">
          <img
            src={`${STATIC_API}/${image.path_to}`}
            alt="post"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 text-gray-300">
        <div className="flex gap-4">
          <button className="hover:text-pink-500">❤</button>
          <button className="hover:text-blue-400">💬</button>
          <button className="hover:text-green-400">🔁</button>
        </div>

        <button className="hover:text-yellow-400">🔖</button>
      </div>
    </div>
  );
};

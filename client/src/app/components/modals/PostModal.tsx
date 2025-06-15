import { Post } from "@/app/types/post.type";
import React from "react";
import postLike from "../../images/postLike.svg";
import justLike from "../../images/justLike.svg";
import repost from "../../images/repost.svg";
import save from "../../images/save.svg";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#292929] rounded-[2px] max-w-[900px] w-full h-[365px] flex gap-4 relative">
        {/* Закрытие */}
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white text-[14px]"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Изображение поста */}
        <div className="h-full w-[365px] flex-shrink-0">
          <Image
            alt="post"
            src={`data:image/png;base64,${post.imageBase64}`}
            width={365}
            height={365}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Контент справа */}
        <div className="flex flex-col flex-1 overflow-hidden p-2 ">
          {/* Заголовок и лайки */}
          <div className="flex items-center gap-2 mb-[5px]">
            <div className="w-[28px] h-[28px] rounded-full bg-gray-500" />
            <span className="text-white text-sm font-medium">@username</span>
          </div>
          {/* <div className="mb-2">
            <h2 className="text-lg font-semibold text-white">
              {post.post_title}
            </h2>
            <p className="text-sm text-gray-300">Likes: {post.likes}</p>
          </div> */}

          {/* Комментарии */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-[10px] max-h-[270px] hide-scrollbar">
            {[1, 2, 3, 4, 5, 6, 7].map((id) => (
              <div
                key={id}
                className="flex items-center justify-between gap-3 "
              >
                {/* Аватар */}
                <div className="w-[28px] h-[28px] rounded-full bg-gray-500 flex-shrink-0" />

                {/* Комментарий */}
                <div className="flex flex-col text-[12px] text-white flex-1">
                  <p className="text-white font-medium mb-1">
                    @username{id}:{" "}
                    <span className="font-normal text-gray-300">
                      Sample comment content goes here.
                    </span>
                  </p>
                  <span className="text-xs text-gray-400">2h ago</span>
                </div>

                {/* Лайки */}
                <div className="flex flex-col items-center text-xs text-gray-400">
                  <Image
                    alt="like"
                    src={postLike}
                    width={10}
                    height={10}
                    className="w-full h-full object-cover rounded"
                  />
                  <span>12</span>
                </div>
              </div>
            ))}
          </div>

          {/* Нижняя панель */}
          <div className="pt-2 border-t border-gray-700 mt-2 flex flex-col gap-2">
            {/* Иконки действий */}
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Image
                    alt="like"
                    src={justLike}
                    width={20}
                    height={20}
                    className="w-full h-full  rounded"
                  />
                  <p className="mt-[-2px]">{post.likes}</p>
                </div>
                <div className="flex flex-col items-center">
                  <Image
                    alt="like"
                    src={repost}
                    width={20}
                    height={20}
                    className="w-full h-full rounded"
                  />
                  <p className="mt-[-2px]">11</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                {/* Заглушка для иконки сохранения */}
                <Image
                  alt="like"
                  src={save}
                  className="w-[13px] h-[19px] object-cover rounded"
                />
                <p className="mt-[-2px]">11</p>
              </div>
            </div>

            {/* Поле ввода комментария */}
            <div className="flex items-center gap-2 px-1">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 text-sm text-white placeholder-gray-400 outline-none h-[30px] bg-transparent border-none"
              />
              <span className="text-sm text-blue-400 cursor-pointer">
                Publish
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

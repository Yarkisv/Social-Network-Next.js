"use client";

import { Post } from "@/app/types/post.type";
import React, { useEffect, useState } from "react";
import postLike from "../../images/postLike.svg";
import justLike from "../../images/justLike.svg";

import Image from "next/image";
import axiosInstance from "@/lib/axios";
import axios, { AxiosError } from "axios";
import { Comment } from "@/app/types/comment.type";

type PostModalProps = {
  post: Post | undefined | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function PostModal({ isOpen, onClose, post }: PostModalProps) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [currentPost, setCurrentpost] = useState<Post>();
  const [content, setContent] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPostLikedByUser, setIsPostLikedByUser] = useState<boolean>(false);

  useEffect(() => {
    const isLiked = async () => {
      try {
        const response = await axiosInstance.post("comment/new", {
          content: content,
          post_id: post?.post_id,
        });

        if (response.data) {
          setIsPostLikedByUser(response.data);
        }
      } catch (error) {}
    };

    isLiked();
  }, []);

  const fetchAllComments = async () => {
    try {
      const response = await axios.get(
        `${API}/comment/get/all/${post?.post_id}`
      );

      if (response.status === 200) {
        setComments(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendComment = async () => {
    try {
      const response = await axiosInstance.post("comment/new", {
        content: content,
        post_id: post?.post_id,
      });

      if (response.status === 201) {
        fetchAllComments();
        setContent("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const commentDate = new Date(date);

    const diffInMilliseconds = now.getTime() - commentDate.getTime();

    const diffInSeconds = diffInMilliseconds / 1000;
    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    if (diffInSeconds < 60) return "Sent just now";
    if (diffInMinutes < 60) return `Sent ${Math.round(diffInMinutes)} min. ago`;
    if (diffInHours < 24) return `Sent ${Math.round(diffInHours)} h. ago`;
    return `Sent ${Math.round(diffInDays)} days ago`;
  };

  const handleLikePost = async () => {
    try {
      if (!isPostLikedByUser) {
        const response = await axiosInstance.post("like/create", {
          post_id: post?.post_id,
        });
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 409) {
        console.log("Already liked");
      }
    }
  };

  useEffect(() => {
    if (post) {
      fetchAllComments();
    }
  }, [post?.post_id]);

  if (!isOpen || !post) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#292929] rounded-[2px] max-w-[900px] w-full h-[365px] flex gap-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white text-[14px] cursor-pointer"
          onClick={onClose}
        >
          x
        </button>

        <div className="h-full w-[365px] flex-shrink-0">
          <Image
            alt="post"
            src={`data:image/png;base64,${post.imageBase64}`}
            width={365}
            height={365}
            className="w-full h-full object-cover rounded"
          />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden p-2 ">
          <div className="flex items-center gap-2 mb-[5px]">
            <Image
              src={`data:image/png;base64,${post.userAvatar}`}
              alt="userAvatar"
              height={28}
              width={28}
              className="rounded-full"
            />
            <span className="text-white text-sm font-medium">
              {post.username}
            </span>
          </div>
          <div className="mb-2">
            {post.post_title ? (
              <h2 className="text-lg font-semibold text-white">
                {post.post_title}
              </h2>
            ) : (
              <div></div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-[10px] max-h-[270px] hide-scrollbar">
            {comments.length > 0 ? (
              <div>
                {comments.map((comment) => (
                  <div
                    key={comment.comment_id}
                    className="flex items-center justify-between gap-3 "
                  >
                    <Image
                      alt="avatar"
                      src={`data:image/png;base64,${comment.senderAvatarBase64}`}
                      width={28}
                      height={28}
                      className="object-cover rounded"
                    />

                    <div className="flex flex-col text-[12px] text-white flex-1">
                      <p className="text-white font-medium mb-1">
                        {comment.senderUsername}
                        <span className="font-normal text-gray-300">
                          {comment.content}
                        </span>
                      </p>
                      <span className="text-xs text-gray-400">
                        {comment.sent_at
                          ? getRelativeTime(comment.sent_at)
                          : "error"}
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-xs text-gray-400">
                      <Image
                        alt="like"
                        src={postLike}
                        width={10}
                        height={10}
                        className="w-full h-full object-cover rounded"
                      />
                      <span>{comment.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p>No comments yet</p>
              </div>
            )}
          </div>
          <div className="pt-2 border-t border-gray-700 mt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-4">
                <div
                  className="flex flex-col items-center"
                  onClick={handleLikePost}
                >
                  <Image
                    alt="like"
                    src={justLike}
                    width={20}
                    height={20}
                    className="w-full h-full  rounded"
                  />
                  <p className="mt-[-2px]">{post.likes?.length}</p>
                </div>
                {/* <div className="flex flex-col items-center">
                  <Image
                    alt="like"
                    src={repost}
                    width={20}
                    height={20}
                    className="w-full h-full rounded"
                  />
                  <p className="mt-[-2px]">11</p>
                </div> */}
              </div>
              {/* <div className="flex flex-col items-center">
                <Image
                  alt="like"
                  src={save}
                  className="w-[13px] h-[19px] object-cover rounded"
                />
                <p className="mt-[-2px]">11</p>
              </div> */}
            </div>
            <div className="flex items-center gap-2 px-1">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 text-sm text-white placeholder-gray-400 outline-none h-[30px] bg-transparent border-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
              />
              <span
                className="text-sm text-blue-400 cursor-pointer"
                onClick={handleSendComment}
              >
                Publish
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

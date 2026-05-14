"use client";

import { Post } from "@/app/types/post.type";
import React, { useEffect, useState } from "react";
import postLike from "../../images/postLike.svg";
import justLike from "../../images/justLike.svg";
import redLike from "../../images/RedLike.svg";
import save from "../../images/save.svg";
import PreviosImg from "../../images/PreviosImg.svg";
import NextImg from "../../images/NextImg.svg";

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
  const API_STATIC = process.env.NEXT_PUBLIC_STATIC_URL;

  const [currentPost, setCurrentPost] = useState<Post | null>();
  const [content, setContent] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPostLikedByUser, setIsPostLikedByUser] = useState<boolean>(false);
  const [indexOfPostImage, setIndexOfPostImage] = useState<number>(0);

  useEffect(() => {
    if (!post) {
      return;
    }

    setCurrentPost(post);

    const isLiked = async () => {
      try {
        const response = await axiosInstance.get(
          `/like/check-is-already-liked/${post?.post_id}`,
        );

        setIsPostLikedByUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    isLiked();
  }, [post?.post_id]);

  const handleLikePost = async () => {
    try {
      if (!isPostLikedByUser) {
        const response = await axiosInstance.post("like/create", {
          post_id: post?.post_id,
        });

        const newLike = response.data;

        setCurrentPost((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            likes: [...(prev.likes || []), newLike],
          };
        });

        setIsPostLikedByUser(true);
      } else {
        const response = await axiosInstance.delete(
          `like/delete/${post?.post_id}`,
        );

        const deletedLike_id = response.data;

        setCurrentPost((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            likes: prev.likes?.filter(
              (like) => like.like_id !== deletedLike_id,
            ),
          };
        });

        setIsPostLikedByUser(false);
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 409) {
        console.log("Already liked");
      }
    }
  };

  const fetchAllComments = async () => {
    try {
      const response = await axios.get(
        `${API}/comment/get/all/${post?.post_id}`,
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

  const handleNextImage = () => {
    const images = post?.images ?? [];
    const imagesCount = images.length - 1;

    setIndexOfPostImage((prevIndexOfPostImage) =>
      prevIndexOfPostImage === imagesCount
        ? (prevIndexOfPostImage = imagesCount)
        : prevIndexOfPostImage + 1,
    );
  };

  const handlePreviosImage = () => {
    setIndexOfPostImage((prevIndexOfPostImage) =>
      prevIndexOfPostImage === 0
        ? (prevIndexOfPostImage = 0)
        : prevIndexOfPostImage - 1,
    );
  };

  const handleSavePost = async () => {
    try {
      const response = await axiosInstance.post("saved-posts/new", {
        post_id: post?.post_id,
      });
    } catch (error) {
      console.log(error);
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

        <div className="h-full w-[365px] flex-shrink-0 relative">
          {post?.images?.length > 1 && (
            <>
              <button
                onClick={handlePreviosImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
              >
                <Image
                  src={PreviosImg}
                  alt="previous"
                  className="w-6 h-6 cursor-pointer"
                />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
              >
                <Image
                  src={NextImg}
                  alt="next"
                  className="w-6 h-6 cursor-pointer"
                />
              </button>
            </>
          )}

          <Image
            alt="post"
            src={`${API_STATIC}/${currentPost?.images[indexOfPostImage].path_to}`}
            width={365}
            height={365}
            className="w-full h-full object-cover rounded"
          />

          {post?.images?.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {post.images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === indexOfPostImage
                      ? "bg-white"
                      : "bg-gray-500 opacity-60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 overflow-hidden p-2 ">
          <div className="flex items-center gap-2 mb-[5px]">
            <Image
              src={`${API_STATIC}/${currentPost?.userAvatar}`}
              alt="userAvatar"
              height={28}
              width={28}
              className="rounded-full"
            />
            <span className="text-white text-sm font-medium">
              {currentPost?.username}
            </span>
          </div>

          <div className="mb-2">
            {currentPost?.post_title ? (
              <h2 className="text-lg font-semibold text-white">
                {currentPost?.post_title}
              </h2>
            ) : (
              <div></div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-[10px] max-h-[270px] hide-scrollbar">
            {comments.length > 0 ? (
              <div className="space-y-[10px]">
                {comments.map((comment) => (
                  <div
                    key={comment.comment_id}
                    className="flex items-center justify-between gap-3 "
                  >
                    <Image
                      alt="avatar"
                      src={`${API_STATIC}/${comment.senderAvatarPathTo}`}
                      width={28}
                      height={28}
                      className="object-cover rounded"
                    />

                    <div className="flex flex-col text-[12px] text-white  flex-1">
                      <p className="text-white font-medium mb-1 ">
                        {comment.senderUsername}
                        <span className="ml-1 font-normal text-gray-300">
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
                    src={isPostLikedByUser ? redLike : justLike}
                    width={20}
                    height={20}
                    className="w-full h-full rounded cursor-pointer"
                  />
                  <p className="mt-[-2px]">{currentPost?.likes?.length}</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Image
                  alt="like"
                  src={save}
                  className="w-[13px] h-[19px] object-cover rounded cursor-pointer"
                  onClick={handleSavePost}
                />
              </div>
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

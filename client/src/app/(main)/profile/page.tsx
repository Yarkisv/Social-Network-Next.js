"use client";

import React, { useEffect, useState } from "react";
import AsideInfo from "../../components/asideInfo";
import axios from "axios";
import ProfilePost from "../../images/ProfilePost.png";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  openUploadPostWindow,
  closePostModalWindow,
  openPostModalWindow,
} from "@/app/store/slices/modalSlice";
import { initialUser } from "@/app/store/slices/userSlice";
import PostModal from "@/app/components/modals/PostModal";
import { Post } from "@/app/types/post.type";
import { User } from "@/app/types/user.type";

export default function page() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>();
  const [selectedPost, setSelectedPost] = useState<Post | null>();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const isPostModalOpen = useAppSelector(
    (state) => state.modal.isPostModalOpen
  );

  const dispatch = useAppDispatch();

  const fetchData = async () => {
    try {
      const userRes = await axios.get(`${API}/auth/profile`, {
        withCredentials: true,
      });

      if (userRes.status === 200) {
        setUser(userRes.data);
        dispatch(initialUser(userRes.data));

        const PostsRes = await axios.get(
          `${API}/post/get/${userRes.data?.user_id}`
        );

        if (PostsRes.status === 200) {
          setPosts(PostsRes.data);
        }
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleUploadPostClick = () => {
    dispatch(openUploadPostWindow());
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
    fetchData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#060606]">
        <p className="text-white">user not found</p>
      </div>
    );
  }

  if (!posts) {
    return (
      <div className="min-h-screen bg-[#060606]">
        <p className="text-white">posts not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4 ">
      <div className="w-[182px] bg-[#15121F] ">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] pt-[20px] px-[20px] font-[Manrope]">
        <div className="flex items-start gap-6 mb-10">
          <Image
            className="w-28 h-28 rounded-full object-fit "
            src={`data:image/png;base64,${user.avatarPathTo}`}
            alt="Google"
            width={112}
            height={112}
          />

          <div className="flex flex-col gap-4 flex-1  font-light">
            <div className="flex items-center gap-[15px] ">
              <div className="text-xl font-semibold">{user.fullname}</div>
              <div className="text-gray-400">@{user.username}</div>
            </div>

            <div className="flex gap-8 text-sm text-gray-300  font-light">
              <div>
                <span className="text-white font-medium">{posts.length}</span>{" "}
                posts
              </div>
              <div>
                <span className="text-white font-medium">
                  {user.subscribers ?? 0}
                </span>{" "}
                followers
              </div>
              <div>
                <span className="text-white font-medium">
                  {user.subscriptions ?? 0}
                </span>{" "}
                subscriptions
              </div>
            </div>
            <div className="text-gray-300 ">{user.description ?? ""}</div>
          </div>
        </div>

        <div className="flex justify-center gap-12  mb-4  font-light">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 text-sm font-semibold ${
              activeTab === "posts"
                ? "border-b-2 border-white text-white"
                : "text-gray-500"
            }`}
          >
            POSTS
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-2 text-sm font-semibold ${
              activeTab === "saved"
                ? "border-b-2 border-white text-white"
                : "text-gray-500"
            }`}
          >
            SAVED
          </button>
        </div>

        <div>
          {activeTab === "posts" ? (
            posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-[5px]">
                <div
                  className="h-[233px] w-[233px] bg-white flex items-center justify-center"
                  onClick={handleUploadPostClick}
                >
                  <p className="text-black text-4xl">+</p>
                </div>

                {posts.map((post, index) => (
                  <Image
                    key={index}
                    src={`data:image/jpg;base64,${post.imageBase64}`}
                    alt="post"
                    width={233}
                    height={233}
                    onClick={() => handlePostModalOpen(post)}
                  />
                ))}
              </div>
            ) : (
              <div>
                <p>No posts</p>
                <p>Do you wan't to upload new post?</p>
                <div
                  className="h-[233px] w-[233px] bg-white flex items-center justify-center"
                  onClick={handleUploadPostClick}
                >
                  <p className="text-black text-4xl">+</p>
                </div>
              </div>
            )
          ) : (
            [...Array(3)].map((_, index) => (
              <div className="grid grid-cols-3 gap-[5px]">
                {" "}
                <Image
                  key={index}
                  src={ProfilePost}
                  alt="Google"
                  className="w-full aspect-square object-cover"
                />
              </div>
            ))
          )}
        </div>
      </div>
      <PostModal
        post={selectedPost}
        onClose={handlePostModalClose}
        isOpen={isPostModalOpen}
      />
    </div>
  );
}

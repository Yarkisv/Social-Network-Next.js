"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AsideInfo from "../../components/asideInfo";
import axios from "axios";
import ProfilePost from "../../images/ProfilePost.png";
import Image from "next/image";
import { initialUser } from "@/app/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export default function page() {
  type User = {
    user_id: number;
    fullname: string;
    username: string;
    email: string;
    phone: string;
    subscribers: number;
    subscriptions: number;
    description: string;
    avatarPathTo: string;
  };

  type Post = {
    contentPathTo: string;
    post_title: string;
    likes: number;
  };

  type NewPost = {
    file: File;
    post_title: string;
  };

  const API = process.env.NEXT_PUBLIC_API_URL;
  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>();
  const [hasFetchedPosts, setHasFetchedPosts] = useState(false);

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const checkToken = async () => {
    try {
      const res = await axios.get(`${API}/auth/profile`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUser(res.data);
        dispatch(initialUser(res.data));
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/post/get/${user?.user_id}`);

      if (res.status === 200) {
        setPosts(res.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const uploadNewPost = async (
    user_id: number,
    file: File,
    post_title: string
  ) => {
    try {
      const res = await axios.post(
        `${API}/post/upload/post`,
        {
          user_id,
          file,
          post_title,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {}
  };

  useEffect(() => {
    checkToken();

    if (user?.user_id && !hasFetchedPosts) {
      fetchPosts();
      setHasFetchedPosts(true);
    }
  }, [user, hasFetchedPosts]);

  if (!user) {
    return <div className="min-h-screen bg-[#060606]"></div>;
  }

  if (!posts) {
    return;
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4 ">
      <div className="w-[182px] bg-[#15121F] ">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] pt-[35px] px-[20px]">
        <div className="flex items-start gap-6 mb-10">
          <Image
            className="w-28 h-28 rounded-full object-fit "
            src={`data:image/png;base64,${user.avatarPathTo}`}
            alt="Google"
            width={112}
            height={112}
          />

          <div className="flex flex-col gap-4 flex-1 font-['Source_Code_Pro'] font-light">
            <div className="flex items-center gap-[15px] ">
              <div className="text-xl font-semibold">{user.fullname}</div>
              <div className="text-gray-400">@{user.username}</div>
            </div>

            <div className="flex gap-8 text-sm text-gray-300 font-['Space_Grotesk'] font-light">
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

        <div className="flex justify-center gap-12  mb-4 font-['Source_Code_Pro'] font-light">
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
                {posts.map((post, index) => (
                  <Image
                    key={index}
                    src={`data:image/jpg;base64,${post}`}
                    alt="post"
                    width={233}
                    height={233}
                  />
                ))}
              </div>
            ) : (
              <div>
                <p>No posts</p>
                <p>Do you wan't to upload new post?</p>
                <input type="file" id="file" hidden />
                <label htmlFor="file">
                  <span>File</span>
                </label>
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
    </div>
  );
}

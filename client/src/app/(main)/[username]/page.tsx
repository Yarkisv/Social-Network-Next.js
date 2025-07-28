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
  openSubscribersModal,
  closeSubscribersModal,
  openSubscribtionsModal,
  closeSubscribtionsModal,
} from "@/app/store/slices/modalSlice";
import PostModal from "@/app/components/modals/PostModal";
import { Post } from "@/app/types/post.type";
import { redirect, useParams } from "next/navigation";
import { FullUser } from "@/app/types/full-user.type";
import axiosInstance from "@/lib/axios";
import SubscriptionsModal from "@/app/components/modals/SubscriptionsModal";
import SubscribersModal from "@/app/components/modals/SubscribersModal";

export default function page() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const currentUser = useAppSelector((state) => state.user.user);
  const [fullUserData, setFullUserData] = useState<FullUser>();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isUserCurrent, setIsUserCurrent] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const API = process.env.NEXT_PUBLIC_API_URL;
  const username = params.username;

  const isPostModalOpen = useAppSelector(
    (state) => state.modal.isPostModalOpen
  );

  const isSubscribersModalOpen = useAppSelector(
    (state) => state.modal.isSubscribersModalOpen
  );

  const isSubscriptionsModalOpen = useAppSelector(
    (state) => state.modal.isSubscriptionsModalOpen
  );

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/auth/get-full/${username}`);

      if (response.status === 200) {
        setFullUserData(response.data);

        const isCurrent = currentUser?.username === response.data.user.username;

        setIsUserCurrent(isCurrent);
      }

      if (!isUserCurrent) {
        const isSubscribedRes = await axios.get(
          `${API}/subscription/is-subscribed/${currentUser?.user_id}`,
          {
            params: {
              viewed_user_id: response.data?.user?.user_id,
            },
          }
        );
        if (isSubscribedRes.status === 200) {
          setIsSubscribed(isSubscribedRes.data);
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
    dispatch(openPostModalWindow());
  };

  const handlePostModalClose = () => {
    dispatch(closePostModalWindow());
    setSelectedPost(null);
  };

  const handleSubscribersModalOpen = () => {
    console.log(isSubscribersModalOpen);

    dispatch(openSubscribersModal());
  };

  const handleSubscribersModalclose = () => {
    dispatch(closeSubscribersModal());
  };

  const handleSubscriptionsModalClose = () => {
    dispatch(closeSubscribtionsModal());
  };

  const handleSubscriptionsModalOpen = () => {
    dispatch(openSubscribtionsModal());
  };

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        `${API}/subscription`,
        {
          subscribeToId: fullUserData?.user?.user_id,
          currentDate: new Date(),
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        fetchData();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const res = await axios.delete(
        `${API}/subscription/delete/${fullUserData?.user?.user_id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChatClick = async () => {
    try {
      await axiosInstance.post("chat/new", {
        user_id: fullUserData?.user?.user_id,
        created_at: new Date(),
      });
    } catch (error) {
      console.log(error);
    }

    redirect("/chats");
  };

  useEffect(() => {
    if (username && currentUser) {
      fetchData();
    }
  }, [username, currentUser]);

  if (!fullUserData) {
    return (
      <div className="min-h-screen bg-[#060606]">
        <p className="text-white">user not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex justify-center px-4">
      <div className="w-[198px] bg-[#15121F]">
        <AsideInfo />
      </div>
      <div className="w-full max-w-[730px] pt-[20px] px-[20px] font-[Manrope]">
        <div className="flex items-start gap-6 mb-10">
          <Image
            className="w-28 h-28 rounded-full object-cover"
            src={`data:image/png;base64,${fullUserData.user?.avatarBase64}`}
            alt="Avatar"
            width="112"
            height="112"
          />
          <div className="flex flex-col gap-4 flex-1 font-light">
            <div className="flex items-center gap-[15px]">
              <div className="text-xl font-semibold">
                {fullUserData.user?.fullname}
              </div>
              <div className="text-gray-400">
                @{fullUserData.user?.username}
              </div>
              {!isUserCurrent && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                    className="rounded-[2px] bg-[#5020A1] hover:bg-[#6B3FCF] transition-colors cursor-pointer h-[30px] duration-200 text-white text-sm font-medium px-6 "
                  >
                    {isSubscribed ? "Unsubscribe" : "Subscribe"}
                  </button>
                  <button
                    onClick={handleChatClick}
                    className="rounded-[2px] bg-transparent border border-[#5020A1] cursor-pointer hover:bg-[#1D1333] h-[30px] transition-colors duration-200 text-white text-sm font-medium px-6 "
                  >
                    Chat
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-8 text-sm text-gray-300 font-light">
              <div>
                <span className="text-white font-medium">
                  {fullUserData.posts.length}
                </span>{" "}
                posts
              </div>
              <div
                onClick={handleSubscribersModalOpen}
                className="flex  cursor-pointer gap-1"
              >
                <span className="text-white font-medium">
                  {fullUserData.subscribers.length > 0 ? (
                    <p>{fullUserData.subscribers.length}</p>
                  ) : (
                    <p>0</p>
                  )}
                </span>{" "}
                subscribers
              </div>
              <div
                onClick={handleSubscriptionsModalOpen}
                className="flex  cursor-pointer gap-1"
              >
                <span className="text-white font-medium">
                  {fullUserData.subscriptions.length > 0 ? (
                    <p>{fullUserData.subscriptions.length}</p>
                  ) : (
                    <p>0</p>
                  )}
                </span>{" "}
                subscriptions
              </div>
            </div>
            <div className="text-gray-300">
              {currentUser?.description ?? ""}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-12 mb-4 font-light">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 text-sm cursor-pointer font-semibold ${
              activeTab === "posts"
                ? "border-b-2 border-white text-white"
                : "text-gray-500"
            }`}
          >
            POSTS
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-2 text-sm cursor-pointer font-semibold ${
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
            <div className="grid grid-cols-3 gap-[5px]">
              {isUserCurrent && (
                <div
                  className="h-[233px] bg-[#1E1C29] flex items-center justify-center border border-[#2F2B3A] rounded-lg cursor-pointer hover:bg-[#2A2735] transition-colors duration-200"
                  onClick={handleUploadPostClick}
                >
                  <span className="text-white text-5xl font-light">+</span>
                </div>
              )}

              {fullUserData.posts.map((post, index) => (
                <Image
                  key={index}
                  src={`data:image/jpg;base64,${post.imageBase64}`}
                  alt="post"
                  width={233}
                  height={233}
                  className="w-full h-[233px] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  onClick={() => handlePostModalOpen(post)}
                />
              ))}

              {fullUserData.posts.length % 3 === 1 && (
                <>
                  <div className="h-[233px] rounded-lg" />
                  <div className="h-[233px] rounded-lg" />
                </>
              )}
              {fullUserData.posts.length % 3 === 2 && (
                <div className="h-[233px] rounded-lg" />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-[5px]">
              {[...Array(3)].map((_, index) => (
                <Image
                  key={index}
                  src={ProfilePost}
                  alt="Saved post"
                  className="w-full h-[233px] object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isUserCurrent && (
        <PostModal
          post={selectedPost}
          onClose={handlePostModalClose}
          isOpen={isPostModalOpen}
        />
      )}

      <SubscribersModal
        subs={fullUserData.subscribers}
        isOpen={isSubscribersModalOpen}
        onClose={handleSubscribersModalclose}
      />

      <SubscriptionsModal
        subs={fullUserData.subscriptions}
        isOpen={isSubscriptionsModalOpen}
        onClose={handleSubscriptionsModalClose}
      />
    </div>
  );
}

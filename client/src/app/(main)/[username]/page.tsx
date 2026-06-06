"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import PendingSub from "../../images/PendingSub.svg";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  openUploadPostWindow,
  closePostModalWindow,
  openPostModalWindow,
  openSubscribersModal,
  closeSubscribersModal,
  openSubscribtionsModal,
  closeSubscribtionsModal,
  openPendingSubsModal,
  closePendingSubsModal,
} from "@/app/store/slices/modalSlice";
import PostModal from "@/app/components/modals/PostModal";
import { Post } from "@/app/types/post.type";
import { redirect, useParams } from "next/navigation";
import { FullUser } from "@/app/types/full-user.type";
import axiosInstance from "@/lib/axios";
import SubscriptionsModal from "@/app/components/modals/SubscriptionsModal";
import SubscribersModal from "@/app/components/modals/SubscribersModal";
import UploadPostModal from "@/app/components/modals/UploadPostModal";
import PendingSubscribersModal from "@/app/components/modals/PendingSubsModal";
import PostGrid from "@/app/components/PostGrid";

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
  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;

  const username = params.username;

  const isPostModalOpen = useAppSelector(
    (state) => state.modal.isPostModalOpen,
  );

  const isSubscribersModalOpen = useAppSelector(
    (state) => state.modal.isSubscribersModalOpen,
  );

  const isSubscriptionsModalOpen = useAppSelector(
    (state) => state.modal.isSubscriptionsModalOpen,
  );

  const isPendingModalOpen = useAppSelector(
    (state) => state.modal.isPendingSubsModalOpen,
  );

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/user/get-full/${username}`);

      if (response.status === 200) {
        const data = response.data;

        let subscriptionStatus = "none";

        if (data.isSubscribed) {
          subscriptionStatus = "accepted";
        } else if (data.isPending) {
          subscriptionStatus = "pending";
        }

        setFullUserData({
          ...data,
          subscriptionStatus,
        });

        const isCurrent = currentUser?.username === response.data.user.username;

        setIsUserCurrent(isCurrent);
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
        },
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
        },
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

  const handlePendingSubsOpen = () => {
    dispatch(openPendingSubsModal());
  };

  const handleClosePendingSubsOpen = () => {
    dispatch(closePendingSubsModal());
  };

  useEffect(() => {
    if (username && currentUser) {
      fetchData();
    }
  }, [username, currentUser]);

  if (!fullUserData) {
    return (
      <div className="h-[calc(100vh-46px)] bg-[#060606]">
        <p className="text-white">Pending</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-46px)] w-full max-w-[730px] font-[Manrope] pt-[20px] px-[20px]">
      <div className="flex items-start gap-6 mb-10">
        <Image
          className="w-28 h-28 rounded-full object-cover"
          src={`${STATIC_API}/${fullUserData.user?.avatarPathTo}`}
          alt="Avatar"
          width="112"
          height="112"
        />
        <div className="flex flex-col gap-4 flex-1 font-light">
          <div className="flex items-center gap-[15px]">
            <div className="text-xl font-semibold text-white">
              {fullUserData.user?.fullname}
            </div>

            <div className="text-gray-400">@{fullUserData.user?.username}</div>

            {!isUserCurrent && (
              <div className="flex flex-col sm:flex-row gap-3">
                {fullUserData.subscriptionStatus === "none" && (
                  <button
                    onClick={handleSubscribe}
                    className="rounded-[2px] bg-[#5020A1] hover:bg-[#6B3FCF] transition-colors cursor-pointer h-[30px] duration-200 text-white text-sm font-medium px-6"
                  >
                    Subscribe
                  </button>
                )}

                {fullUserData.subscriptionStatus === "pending" && (
                  <button
                    disabled
                    className="rounded-[2px] bg-gray-600 cursor-not-allowed h-[30px] text-white text-sm font-medium px-6 opacity-70"
                  >
                    Pending...
                  </button>
                )}

                {fullUserData.subscriptionStatus === "accepted" && (
                  <button
                    onClick={handleUnsubscribe}
                    className="rounded-[2px] bg-red-600 hover:bg-red-700 transition-colors cursor-pointer h-[30px] text-white text-sm font-medium px-6"
                  >
                    Unsubscribe
                  </button>
                )}

                {fullUserData.subscriptionStatus === "accepted" && (
                  <button
                    onClick={handleChatClick}
                    className="rounded-[2px] bg-transparent border border-[#5020A1] cursor-pointer hover:bg-[#1D1333] h-[30px] transition-colors duration-200 text-white text-sm font-medium px-6"
                  >
                    Chat
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-8 text-sm text-gray-300 font-light items-center">
            <div>
              <span className="text-white font-medium">
                {fullUserData.posts.length}
              </span>{" "}
              posts
            </div>

            <div
              onClick={handleSubscribersModalOpen}
              className="flex cursor-pointer gap-1"
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
              className="flex cursor-pointer gap-1"
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

            {isUserCurrent && (
              <button
                onClick={handlePendingSubsOpen}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#2A2735] transition-colors duration-200"
              >
                <Image
                  src={PendingSub}
                  alt="Pending subscriptions"
                  className="w-6 h-6 object-contain cursor-pointer"
                />
              </button>
            )}
          </div>

          <div className="text-gray-300">{currentUser?.description ?? ""}</div>
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

        {isUserCurrent && (
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
        )}
      </div>

      <div>
        {activeTab === "posts" ? (
          <div className="grid grid-cols-3 gap-[5px]">
            {isUserCurrent && (
              <div
                className="h-[226px] bg-[#1E1C29] flex items-center justify-center border border-[#2F2B3A] rounded-lg cursor-pointer hover:bg-[#2A2735] transition-colors duration-200"
                onClick={handleUploadPostClick}
              >
                <span className="text-white text-5xl font-light">+</span>
              </div>
            )}

            {fullUserData.posts.map((post) => (
              <div
                key={post.post_id}
                className="relative w-full aspect-square cursor-pointer"
                onClick={() => handlePostModalOpen(post)}
              >
                <Image
                  src={`${STATIC_API}/${post.images[0].path_to}`}
                  alt="post"
                  fill
                  className="object-cover rounded-lg hover:opacity-90 transition-opacity duration-200"
                />
              </div>
            ))}
          </div>
        ) : (
          <PostGrid posts={fullUserData.savedPosts} />
        )}
      </div>

      <PostModal
        post={selectedPost}
        onClose={handlePostModalClose}
        isOpen={isPostModalOpen}
      />

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

      <PendingSubscribersModal
        isOpen={isPendingModalOpen}
        onClose={handleClosePendingSubsOpen}
      />

      <UploadPostModal onPostCreated={fetchData} />
    </div>
  );
}

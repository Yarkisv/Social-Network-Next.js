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
import SubscribersModal from "@/app/components/modals/SubscribersModal";
import SubscriptionsModal from "@/app/components/modals/SubscriptionsModal";
import { Post } from "@/app/types/post.type";
import { User } from "@/app/types/user.type";
import { redirect, useParams } from "next/navigation";
import { Subs } from "@/app/types/subs.type";

import axiosInstance from "@/lib/axios";

export default function page() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const params = useParams();

  const username = params.username;

  const [currentUser, setCurrentUser] = useState<User | null>();
  const [viewedUser, setViewedUser] = useState<User | null>();

  const [subscribers, setSubscribers] = useState<Subs[] | null>([]);
  const [subscriptions, setSubscriptions] = useState<Subs[] | null>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const [posts, setPosts] = useState<Post[]>();
  const [isUserCurrent, setIsUserCurrent] = useState<boolean>(false);

  const [selectedPost, setSelectedPost] = useState<Post | null>();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const isPostModalOpen = useAppSelector(
    (state) => state.modal.isPostModalOpen
  );

  const isSubscribersModalOpen = useAppSelector(
    (state) => state.modal.isSubscribersModalOpen
  );

  const isSubscriptionsModalOpen = useAppSelector(
    (state) => state.modal.isSubscriptionsModalOpen
  );

  const dispatch = useAppDispatch();

  const fetchData = async () => {
    try {
      // получение информации о текущем пользователе
      const currentUser = await axiosInstance.get("/auth/profile");

      if (currentUser.status === 200) {
        // получение постов текущего пользователя
        const postsRes = await axios.get(
          `${API}/post/get/${currentUser.data?.user_id}`
        );

        if (postsRes.status === 200) {
          setPosts(postsRes.data);
        }

        // получение подписок и подписчиков текущего пользователя
        const subscriptionsRes = await axios.get(
          `${API}/subscription/${currentUser.data?.user_id}`
        );

        if (subscriptionsRes.status === 200) {
          setSubscriptions(subscriptionsRes.data.subscriptions);
          setSubscribers(subscriptionsRes.data.subscribers);
        }
      }

      const current = currentUser.data;

      console.log(currentUser.data);

      setCurrentUser(current);

      console.log(username);

      // получение информации просматриваемого пользователя
      const usernameRes = await axios.get(`${API}/user/username/${username}`);

      if (usernameRes.status === 200) {
        // получение постов просматриваемого пользователя
        const postsRes = await axios.get(
          `${API}/post/get/${usernameRes.data?.user_id}`
        );

        if (postsRes.status === 200) {
          setPosts(postsRes.data);
        }

        const subscriptionsRes = await axios.get(
          `${API}/subscription/${usernameRes.data?.user_id}`
        );

        if (subscriptionsRes.status === 200) {
          setSubscriptions(subscriptionsRes.data.subscriptions);
          setSubscribers(subscriptionsRes.data.subscribers);
        }
      }

      const viewed = usernameRes.data;

      console.log(usernameRes.data);

      setViewedUser(viewed);

      const isSubscribedRes = await axios.get(
        `${API}/subscription/is-subscribed/${current?.user_id}`,
        {
          params: {
            viewed_user_id: viewed?.user_id,
          },
        }
      );

      if (isSubscribedRes.status === 200) {
        setIsSubscribed(isSubscribedRes.data);
      }

      if (current.username === viewed.username) {
        setIsUserCurrent(true);
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
    console.log(subscribers);
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
    console.log(subscriptions);

    dispatch(openSubscribtionsModal());
  };

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        `${API}/subscription`,
        {
          subscribeToId: viewedUser?.user_id,
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
    console.log("unsub");

    try {
      const res = await axios.delete(
        `${API}/subscription/delete/${viewedUser?.user_id}`,
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
    redirect("/chats");
  };

  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, [username]);

  if (!viewedUser || !currentUser) {
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

  if (!subscriptions) {
    return (
      <div className="min-h-screen bg-[#060606]">
        <p className="text-white">posts not found</p>
      </div>
    );
  }

  if (!subscribers) {
    return (
      <div className="min-h-screen bg-[#060606]">
        <p className="text-white">posts not found</p>
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
            src={`data:image/png;base64,${viewedUser.avatarBase64}`}
            alt="Avatar"
            width="112"
            height="112"
          />
          <div className="flex flex-col gap-4 flex-1 font-light">
            <div className="flex items-center gap-[15px]">
              <div className="text-xl font-semibold">{viewedUser.fullname}</div>
              <div className="text-gray-400">@{viewedUser.username}</div>
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
                <span className="text-white font-medium">{posts.length}</span>{" "}
                posts
              </div>
              <div
                onClick={handleSubscribersModalOpen}
                className="flex  cursor-pointer gap-1"
              >
                <span className="text-white font-medium">
                  {subscribers.length > 0 ? (
                    <p>{subscribers.length}</p>
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
                  {subscriptions.length > 0 ? (
                    <p>{subscriptions.length}</p>
                  ) : (
                    <p>0</p>
                  )}
                </span>{" "}
                subscriptions
              </div>
            </div>
            <div className="text-gray-300">{viewedUser.description ?? ""}</div>
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

              {posts.map((post, index) => (
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

              {posts.length % 3 === 1 && (
                <>
                  <div className="h-[233px] rounded-lg" />
                  <div className="h-[233px] rounded-lg" />
                </>
              )}
              {posts.length % 3 === 2 && (
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
        subs={subscribers}
        isOpen={isSubscribersModalOpen}
        onClose={handleSubscribersModalclose}
      />

      <SubscriptionsModal
        subs={subscriptions}
        isOpen={isSubscriptionsModalOpen}
        onClose={handleSubscriptionsModalClose}
      />
    </div>
  );
}

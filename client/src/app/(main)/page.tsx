"use client";

import { useEffect, useState } from "react";
import { FeedPostCard } from "../components/FeedPostCard";
import axiosInstance from "@/lib/axios";
import { Post } from "../types/post.type";
import {
  closePostModalWindow,
  openPostModalWindow,
} from "../store/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import PostModal from "../components/modals/PostModal";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>();

  const isPostModalOpen = useAppSelector(
    (state) => state.modal.isPostModalOpen,
  );

  const dispatch = useAppDispatch();

  const fetchFeedPosts = async () => {
    const response = await axiosInstance.get("user/recomendations");

    setPosts(response.data);

    console.log(response.data);
  };

  const handlePostModalOpen = (post: Post) => {
    setSelectedPost(post);

    dispatch(openPostModalWindow());
  };

  const handlePostModalClose = () => {
    dispatch(closePostModalWindow());
    setSelectedPost(null);
  };

  useEffect(() => {
    fetchFeedPosts();
  }, []);

  return (
    <div className="">
      <div className="max-w-2xl mx-auto">
        {posts.map((post: any) => (
          <FeedPostCard
            key={post.post_id}
            post={post}
            onClick={handlePostModalOpen}
          />
        ))}

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center text-white/70">
            <p className="text-lg font-semibold">No recommendations yet</p>
            <p className="text-sm text-white/50 mt-1">
              Add your interests to see personalized posts.
            </p>

            <a
              href="/settings/content"
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm transition"
            >
              Manage interests
            </a>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {posts.map((post: any) => (
              <FeedPostCard
                key={post.post_id}
                post={post}
                onClick={handlePostModalOpen}
              />
            ))}
          </div>
        )}
      </div>

      <PostModal
        post={selectedPost}
        onClose={handlePostModalClose}
        isOpen={isPostModalOpen}
      />
    </div>
  );
}
  
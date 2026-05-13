"use client";

import { useEffect, useState } from "react";
import { FeedPostCard } from "../components/FeedPostCard";
import axiosInstance from "@/lib/axios";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);

  const fetchFeedPosts = async () => {
    const response = await axiosInstance.get("user/recomendations");

    setPosts(response.data);
  };

  useEffect(() => {
    fetchFeedPosts();
  }, []);

  return (
    <div className="h-[calc(100vh-46px)]">
      <div className="max-w-2xl mx-auto">
        {posts.map((post: any) => (
          <FeedPostCard key={post.post_id} post={post} />
        ))}
      </div>
    </div>
  );
}

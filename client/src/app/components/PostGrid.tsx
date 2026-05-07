import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Post } from "../types/post.type";
import {
  closePostModalWindow,
  openPostModalWindow,
} from "../store/slices/modalSlice";
import Image from "next/image";
import PostModal from "./modals/PostModal";

type PostModalProps = {
  posts: Post[];
};

export default function PostGrid({ posts }: PostModalProps) {
  const dispatch = useAppDispatch();
  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;
  const [selectedPost, setSelectedPost] = useState<Post | null>();
  const isPostModalOpen = useAppSelector(
    (state) => state.modal.isPostModalOpen,
  );

  const handlePostModalOpen = (post: Post) => {
    setSelectedPost(post);

    console.log(post);

    dispatch(openPostModalWindow());
  };

  const handlePostModalClose = () => {
    dispatch(closePostModalWindow());
    setSelectedPost(null);
  };

  return (
    <div className="grid grid-cols-3 gap-[5px]">
      {posts.map((post) => (
        <div
          className="relative w-full aspect-square cursor-pointer"
          onClick={() => handlePostModalOpen(post)}
          key={post.post_id}
        >
          <Image
            src={`${STATIC_API}/${post.images[0].path_to}`}
            alt="post"
            fill
            className="object-cover rounded-lg hover:opacity-90 transition-opacity duration-200"
          />
        </div>
      ))}

      <PostModal
        post={selectedPost}
        onClose={handlePostModalClose}
        isOpen={isPostModalOpen}
      />
    </div>
  );
}

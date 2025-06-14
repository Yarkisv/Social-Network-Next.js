"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios from "axios";
import { closeUploadPostWindow } from "@/app/store/slices/modalSlice";
import PostModal from "./PostModal";

export default function UploadPostModal() {
  const isUploadWindowOpen = useAppSelector(
    (state) => state.modal.isUploadWindowOpen
  );

  type Post = {
    user_id: number | undefined;
    folder: string | undefined;
    post_title: string | undefined;
    likes: number | undefined;
    file: File | undefined;
  };

  const API = process.env.NEXT_PUBLIC_API_URL;

  const user_id = useAppSelector((state) => state.user.user_id);
  const user_username = useAppSelector((state) => state.user.username);
  const [preview, setPreview] = useState<string>("");

  const [newPost, setNewPost] = useState<Post>({
    user_id: user_id,
    folder: user_username,
    post_title: undefined,
    likes: undefined,
    file: undefined,
  });

  const dispatch = useAppDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setNewPost((prev) => ({ ...prev, file }));
    }
  };

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const uploadNewPost = async () => {
    try {
      console.log(newPost);

      const res = await axios.post(`${API}/post/upload/post`, newPost, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        setTimeout(() => {
          dispatch(closeUploadPostWindow());
        }, 1000);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    if (!newPost.file) {
      setPreview("");
    } else {
      const srcUrl = URL.createObjectURL(newPost.file);
      setPreview(srcUrl);
    }
  }, [newPost.file]);

  if (!isUploadWindowOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-[700px] w-[400px] bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload post</h2>

        <input type="file" id="file" hidden onChange={handleFileChange} />
        <label
          htmlFor="file"
          className="ml-auto self-center bg-[#5020A1] text-white px-[26px] py-[6px] rounded-md hover:bg-purple-700 transition cursor-pointer"
        >
          Upload
        </label>

        {preview && (
          <div>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-64 object-contain rounded-md"
            />

            <label htmlFor="title">Title</label>
            <textarea
              name="post_title"
              id="post_title"
              onChange={handleOnChange}
            />

            <button onClick={uploadNewPost}>Upload post</button>
          </div>
        )}
      </div>
    </div>
  );
}

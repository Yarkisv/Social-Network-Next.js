"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios from "axios";
import { closeUploadPostWindow } from "@/app/store/slices/modalSlice";
import cancel_upload from "../../images/cancel_upload.svg";
import PostModal from "./PostModal";
import createPostImg from "../../images/createPostImg.svg";
import Image from "next/image";

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

  const handleOnClose = () => {
    dispatch(closeUploadPostWindow());
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/60">
      <div className="flex font-[Space_Grotesk] relative  flex-col items-center justify-center h-[440px] w-[400px] text-white bg-[#292929] rounded-[2px] pt-[15px] pb-[20px] px-[20px] overflow-hidden">
        <Image
          onClick={handleOnClose}
          src={cancel_upload}
          alt="Avatar"
          className="absolute top-[10px] right-[10px] "
        />
        <h2 className="text-[20px] mb-auto">Creating a publication</h2>

        {!preview && (
          <>
            <Image
              src={createPostImg}
              alt="Avatar"
              width={60}
              height={60}
              className="object-cover w-[60px] h-[60px] mb-[15px]"
            />
            <p className="font-light text-[#BABABA] mb-[89px]">
              add files to create a post
            </p>
            <input type="file" id="file" hidden onChange={handleFileChange} />
            <label
              htmlFor="file"
              className="bg-[#5020A1] text-white w-[132px] h-[34px] mb-[49px] flex items-center justify-center rounded-[2px] hover:bg-purple-700 transition cursor-pointer"
            >
              Upload
            </label>
          </>
        )}

        {preview && (
          <div className="flex flex-col items-center w-full">
            <img
              src={preview}
              alt="Preview"
              className="w-[200px] h-[200px] object-contain rounded-md mb-4"
            />

            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2">
                <div className="w-[28px] h-[28px] rounded-full bg-gray-500" />
                <span className="text-white text-sm font-medium">
                  @username
                </span>
              </div>
              <button
                onClick={uploadNewPost}
                className="bg-[#5020A1] hover:bg-purple-700 transition text-white px-4 py-1.5 rounded text-sm"
              >
                Upload post
              </button>
            </div>

            <textarea
              name="post_title"
              id="post_title"
              onChange={handleOnChange}
              className="w-full h-[80px] bg-[#1e1e1e] text-white p-2 rounded resize-none text-sm outline-none "
              maxLength={200}
              placeholder="Write a caption..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

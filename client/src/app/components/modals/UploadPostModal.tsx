"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios from "axios";
import { closeUploadPostWindow } from "@/app/store/slices/modalSlice";
import cancel_upload from "../../images/cancel_upload.svg";
import createPostImg from "../../images/createPostImg.svg";
import Image from "next/image";

export default function UploadPostModal({
  onPostCreated,
}: {
  onPostCreated: () => void;
}) {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const API_STATIC = process.env.NEXT_PUBLIC_STATIC_URL;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.user);
  const isUploadWindowOpen = useAppSelector(
    (state) => state.modal.isUploadWindowOpen,
  );
  const handleOnClose = () => {
    dispatch(closeUploadPostWindow());
  };

  const [isFiles, setIsFiles] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [postTitle, setPostTitle] = useState("");
  const [hashtag, setHashtag] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setFiles((prev) => [...prev, ...selectedFiles]);
    setIsFiles(true);
  };

  const uploadNewPost = async () => {
    try {
      const formData = new FormData();

      formData.append("user_id", String(currentUser?.user_id));
      formData.append("folder", currentUser?.username || "");
      formData.append("post_title", postTitle || "");
      formData.append("hashtag", hashtag || "");

      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await axios.post(`${API}/post/upload/post`, formData);

      if (res.status === 200) {
        setTimeout(() => {
          setIsFiles(false);
          setFiles([]);
          onPostCreated();
          dispatch(closeUploadPostWindow());
        }, 500);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {}, []);

  if (!isUploadWindowOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/60">
      <div className="flex font-[Space_Grotesk] relative  flex-col items-center justify-center h-[440px] w-[400px] text-white bg-[#292929] rounded-[2px] pt-[15px] pb-[20px] px-[20px] overflow-hidden">
        <Image
          onClick={handleOnClose}
          src={cancel_upload}
          alt="Avatar"
          className="absolute top-[10px] right-[10px] cursor-pointer"
        />
        <h2 className="text-[20px] mb-auto">Creating a publication</h2>

        {!isFiles ? (
          <>
            <Image
              src={createPostImg}
              alt="Avatar"
              width={60}
              height={60}
              className="object-cover w-[60px] h-[60px] mb-[15px]"
              style={{ width: "60px", height: "60px" }}
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
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="flex gap-2 flex-wrap">
              {files.map((file, index) => {
                const url = URL.createObjectURL(file);

                return (
                  <img
                    key={index}
                    src={url}
                    alt={`file-${index}`}
                    className="w-[100px] h-[100px] object-cover rounded"
                  />
                );
              })}
            </div>

            <input type="file" id="file" hidden onChange={handleFileChange} />
            <label
              htmlFor="file"
              className="bg-[#5020A1] text-white w-[132px] h-[34px] mb-[49px] flex items-center justify-center rounded-[2px] hover:bg-purple-700 transition cursor-pointer"
            >
              Add one more photo
            </label>

            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full"
                  src={`${API_STATIC}/${currentUser?.avatarPathTo}`}
                  alt="avatar"
                  height={28}
                  width={28}
                  style={{ width: "28px", height: "28px" }}
                />
                <span className="text-white text-sm font-medium">
                  {currentUser?.username}
                </span>
              </div>
              <button
                onClick={uploadNewPost}
                className="bg-[#5020A1] hover:bg-purple-700 transition text-white px-4 py-1.5 rounded text-sm cursor-pointer"
              >
                Upload post
              </button>
            </div>

            <textarea
              onChange={(e) => {
                setPostTitle(e.target.value);
              }}
              className="w-full h-[80px] bg-[#1e1e1e] text-white p-2 rounded resize-none text-sm outline-none "
              maxLength={200}
              placeholder="Write a caption..."
            />
            <textarea
              onChange={(e) => {
                setHashtag(e.target.value);
              }}
              className="w-full h-[80px] bg-[#1e1e1e] text-white p-2 rounded resize-none text-sm outline-none "
              maxLength={200}
              placeholder="Write a hashtag..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import axios from "axios";
import { closeUploadPostWindow } from "@/app/store/slices/modalSlice";
import cancel_upload from "../../images/cancel_upload.svg";
import createPostImg from "../../images/createPostImg.svg";
import PreviosImg from "../../images/PreviosImg.svg";
import NextImg from "../../images/NextImg.svg";
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
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setFiles((prev) => [...prev, ...selectedFiles]);
    setIsFiles(true);
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [files, isFiles]);

  const uploadNewPost = async () => {
    try {
      const formData = new FormData();

      formData.append("user_id", String(currentUser?.user_id));
      formData.append("folder", currentUser?.username || "");
      formData.append("post_title", postTitle || "");

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

  if (!isUploadWindowOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/60">
      <div className="flex font-[Space_Grotesk] relative flex-col items-center justify-center h-[440px] w-[400px] text-white bg-[#292929] rounded-[2px] pt-[15px] pb-[20px] px-[20px] overflow-hidden">
        <Image
          onClick={handleOnClose}
          src={cancel_upload}
          alt="Avatar"
          className="absolute top-[10px] right-[10px] cursor-pointer"
        />

        <h2 className="text-[20px] mb-auto">Створення публікації</h2>

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
              Додайте медіа
            </p>

            <input type="file" id="file" hidden onChange={handleFileChange} />
            <label
              htmlFor="file"
              className="bg-[#5020A1] text-white w-[132px] h-[34px] mb-[49px] flex items-center justify-center rounded-[2px] hover:bg-purple-700 transition cursor-pointer"
            >
              Завантажити
            </label>
          </>
        ) : (
          <div className="flex flex-col items-center w-full relative">
            <div className="relative w-[240px] h-[240px] flex items-center justify-center">
              {files.length > 1 && activeIndex > 0 && (
                <button
                  onClick={() => setActiveIndex((p) => p - 1)}
                  className="absolute left-[-35px] top-1/2 -translate-y-1/2 z-10"
                >
                  <Image
                    src={PreviosImg}
                    alt="prev"
                    className="w-6 h-6 cursor-pointer"
                  />
                </button>
              )}

              {files[activeIndex] && (
                <img
                  src={URL.createObjectURL(files[activeIndex])}
                  className="w-[240px] h-[240px] object-cover rounded"
                  alt="preview"
                />
              )}

              {files.length > 1 && activeIndex < files.length - 1 && (
                <button
                  onClick={() => setActiveIndex((p) => p + 1)}
                  className="absolute right-[-35px] top-1/2 -translate-y-1/2 z-10"
                >
                  <Image
                    src={NextImg}
                    alt="next"
                    className="w-6 h-6 cursor-pointer"
                  />
                </button>
              )}

              {files.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {files.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i === activeIndex
                          ? "bg-white"
                          : "bg-gray-500 opacity-60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <input type="file" id="file" hidden onChange={handleFileChange} />

            <label
              htmlFor="file"
              className="absolute bottom-[160px] bg-[#5020A1] text-white px-3 py-2 rounded-[999px] text-xs hover:bg-purple-700 transition cursor-pointer shadow-md"
            >
              + Додати фото
            </label>

            <div className="flex items-center justify-between w-full mb-3 mt-4">
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full"
                  src={`${API_STATIC}/${currentUser?.avatarPathTo}`}
                  alt="avatar"
                  height={28}
                  width={28}
                />
                <span className="text-white text-sm font-medium">
                  {currentUser?.username}
                </span>
              </div>

              <button
                onClick={uploadNewPost}
                className="bg-[#5020A1] hover:bg-purple-700 transition text-white px-4 py-1.5 rounded text-sm cursor-pointer"
              >
                Створити пост
              </button>
            </div>

            <textarea
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full h-[80px] bg-[#1e1e1e] text-white p-2 rounded resize-none text-sm outline-none"
              maxLength={200}
              placeholder="Додайте опис..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

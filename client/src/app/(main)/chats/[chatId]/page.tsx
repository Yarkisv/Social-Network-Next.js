"use client";

import Image from "next/image";
import likeChat from "../../../images/likeChat.svg";
import NoChats from "../../../images/NoChats.svg";
import AddFiile from "../../../images/AddFiile.svg";
import sendMessageButton from "../../../images/sendMessageButton.svg";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Chat } from "@/app/types/chat.type";
import { SocketApi } from "@/api/socket-api";
import { Message } from "@/app/types/message.type";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  openMessageSettingsModal,
  closeMessageSettingsModal,
  setSelectedMessageId,
} from "@/app/store/slices/modalSlice";

import { useRef } from "react";
export default function page() {
  const STATIC_API = process.env.NEXT_PUBLIC_STATIC_URL;
  const API = process.env.NEXT_PUBLIC_API_URL;

  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.user);
  const isMessageSettingOpen = useAppSelector(
    (state) => state.modal.isMessageSettingsModalOpen,
  );
  const selectedMessageId = useAppSelector(
    (state) => state.modal.selectedMessageId,
  );

  const [chat, setChat] = useState<Chat>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string | undefined>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const params = useParams();
  const chat_id = params.chatId;

  const fetchChatInfo = async () => {
    try {
      const response = await axiosInstance.get(`chat/get/${chat_id}`);

      if (response.status === 200) {
        setChat(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        redirect("/chats");
      } else {
        console.log("Unexpected error:", error);
      }
    }
  };

  const fetchAllMessages = async () => {
    try {
      const response = await axios.get(`${API}/messages/get/${chat_id}`);

      if (response.status === 200) {
        console.log(response.data);
        setMessages(response.data);
        markAsRead(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = () => {
    const payload = {
      chat_id: Number(chat_id),
      content: message,
    };

    const text = message.trim();

    if (text && SocketApi.socket?.connected) {
      SocketApi.socket?.emit("message", payload);
    }

    setMessage("");
  };

  const sendFileMessage = async (
    file: File,
    chat_id: number,
    content?: string,
  ) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("chat_id", String(chat_id));

    if (content) {
      formData.append("content", content);
    }

    await axios.post(`${API}/messages/file`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleAction = () => {
    if (message.trim()) {
      sendMessage();
    } else {
      fileInputRef.current?.click();
    }
  };

  const deleteMessage = (message_id?: number) => {
    const payload = {
      chat_id: Number(chat_id),
      message_id: message_id,
    };

    if (SocketApi.socket?.connected) {
      SocketApi.socket?.emit("deleteMessage", payload);
    }
  };

  const editMessage = (message_id?: number, new_content?: string) => {
    const payload = {
      chat_id: Number(chat_id),
      message_id: message_id,
      new_content,
    };

    if (SocketApi.socket?.connected) {
      SocketApi.socket?.emit("editMessage", payload);
    }
  };

  const handleEditClick = () => {
    const message = messages.find((m) => m.message_id === selectedMessageId);

    if (message) {
      setEditText(message.content);
      setIsEditing(true);
    }
  };

  const markAsRead = (msgs: any) => {
    const last = msgs[msgs.length - 1];

    if (!last) return;

    SocketApi.socket?.emit("chat:read", {
      chatId: last.chat_id,
      lastMessageId: last.message_id,
    });
  };

  useEffect(() => {
    fetchChatInfo();
    fetchAllMessages();
  }, []);

  SocketApi.socket?.on("newMessage", (message) => {
    setMessages((prev) => {
      const exists = prev.some(
        (m) => Number(m.message_id) === Number(message.message_id),
      );
      if (exists) return prev;
      const normalized: Message = {
        message_id: message.message_id,
        content: message.content,
        type: message.type,
        media_path: message.media_path,
        user_id: message.user_id,
        chat_id: message.chat_id,
        time: message.time,
      };
      return [...prev, normalized];
    });
  });

  SocketApi.socket?.on("deletedMessage", (message_id) => {
    setMessages((prev) =>
      prev.filter((message) => message.message_id !== message_id),
    );
  });

  SocketApi.socket?.on("editedMessage", (data) => {
    const { message_id, new_content } = data;

    setMessages((prev) =>
      prev.map((message) =>
        message.message_id === message_id
          ? { ...message, content: new_content }
          : message,
      ),
    );
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOpenMessageSettingsModal = (messageId?: number) => {
    dispatch(openMessageSettingsModal());
    dispatch(setSelectedMessageId(messageId));
  };

  const handleCloseMessageSettingsModal = () => {
    dispatch(closeMessageSettingsModal());
  };

  if (!chat || !currentUser) {
    return null;
  }

  const renderMessageContent = (message: any) => {
    switch (message.type) {
      case "image":
        return (
          <Image
            src={`${STATIC_API}/${message.media_path}`}
            alt="image"
            width={400}
            height={400}
          />
        );

      case "video":
        return (
          <video controls className="max-w-full rounded-[6px] mt-2">
            <source src={`${STATIC_API}/${message.media_path}`} />
          </video>
        );

      case "file":
        return (
          <a
            href={`${STATIC_API}/${message.media_path}`}
            className="text-blue-400 underline mt-2 block"
            target="_blank"
          >
            Download file
          </a>
        );

      default:
        return (
          <p className="text-sm text-white break-words whitespace-pre-wrap w-[95%]">
            {message.content}
          </p>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-46px)] bg-[#060606] text-white flex justify-center">
      <div className="w-full relative max-w-[730px] flex flex-col flex-1 bg-[#120921] px-[24px] pt-[24px] gap-4 font-[Manrope] rounded-[2px] shadow-lg">
        <header className="flex items-center border-b border-[#2f2f2f] pb-3">
          <Image
            src={`${STATIC_API}/${chat.avatarPathTo}`}
            alt="Chat avatar"
            height={10}
            width={10}
            priority
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <h2 className="text-xl font-semibold text-white">{chat?.chatName}</h2>
        </header>

        <div className="flex flex-col flex-1 min-h-0">
          <section
            id="messagesContainer"
            className="flex-1 overflow-y-auto flex flex-col gap-3 w-full font-[Manrope] font-[400] pr-1 pb-2 scrollbar-visible"
          >
            {messages.length > 0 ? (
              <div className="flex flex-col gap-2 justify-end">
                {messages.map((message) => {
                  const isMine =
                    currentUser && message.user_id === currentUser.user_id;

                  return isMine ? (
                    <div
                      className="group relative self-end ml-auto my-[6px] bg-green-600 rounded-[6px] rounded-br-[0px] max-w-[70%] flex flex-col py-2 px-3"
                      key={message.message_id}
                    >
                      <button
                        onClick={() => {
                          handleOpenMessageSettingsModal(message.message_id);
                        }}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs"
                      >
                        ⋮
                      </button>
                      <div className="flex justify-between items-center gap-[10px] mb-1">
                        <p className="text-sm font-medium text-white">You</p>
                        <span className="text-xs text-gray-300">
                          {formatTime(new Date(message.time))}
                        </span>
                      </div>

                      <div className="flex justify-between gap-2 mt-1">
                        {renderMessageContent(message)}

                        <div className="flex items-end flex-shrink-0">
                          <Image
                            src={likeChat}
                            alt="Like icon"
                            className="h-[14px] w-[14px] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="self-start my-[6px] bg-[#252037] ml-[10px] rounded-[6px] rounded-bl-[0px] max-w-[70%] flex flex-col py-2 px-3"
                      key={message.message_id}
                    >
                      <div className="flex justify-between items-center gap-[20px] mb-1">
                        <p className="text-sm font-medium text-white">
                          {chat?.chatName}
                        </p>
                        <span className="text-xs text-gray-300">
                          {formatTime(new Date(message.time))}
                        </span>
                      </div>

                      <div className="flex justify-between gap-2 mt-1">
                        {renderMessageContent(message)}

                        <div className="flex items-end flex-shrink-0">
                          <Image
                            src={likeChat}
                            alt="Like icon"
                            className="h-[14px] w-[14px] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-20 text-center text-white/70">
                <Image
                  src={NoChats}
                  alt="Saved post"
                  className="h-[40px] w-[40px] object-cover mb-[5px]"
                />
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm text-white/50">
                  Write your first message here.
                </p>
              </div>
            )}
          </section>
        </div>

        <footer className="flex sticky bottom-0 items-center gap-[8px] p-3 bg-[#1c1c1e] border-t border-[#2a2a2e] rounded-t-xl shadow-lg">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-[#333] outline-none"
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              sendFileMessage(file, Number(chat_id));
            }}
          />

          <button
            className="cursor-pointer w-[50px] h-[50px] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg bg-[#9333EA] hover:bg-[#7e22ce] flex items-center justify-center"
            onClick={handleAction}
          >
            <Image
              src={message.trim() ? sendMessageButton : AddFiile}
              alt="Action icon"
              className="h-[20px] w-[20px] object-contain"
            />
          </button>
        </footer>
      </div>

      {isMessageSettingOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleCloseMessageSettingsModal}
        >
          <div
            className="bg-white rounded-lg p-4 w-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-black">
              Message settings
            </h2>

            {isEditing ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border rounded p-2 text-black mb-3"
                  rows={3}
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      editMessage(selectedMessageId, editText);
                      handleCloseMessageSettingsModal();
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    deleteMessage(selectedMessageId);
                    handleCloseMessageSettingsModal();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-red-100 text-black rounded"
                >
                  Delete message
                </button>

                <button
                  onClick={handleEditClick}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-black rounded"
                >
                  Edit message
                </button>

                <button
                  onClick={handleCloseMessageSettingsModal}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-black rounded mt-2"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

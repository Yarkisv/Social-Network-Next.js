"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { initialUser } from "@/app/store/slices/userSlice";
import axiosInstance from "@/lib/axios";

export function HydrateUser({ user }: { user: any }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.statusCode === 401) {
      axiosInstance.get("/auth/me").then((res) => {
        dispatch(initialUser(res.data));
      });
    } else {
      dispatch(initialUser(user));
    }
  }, [user]);

  return null;
}

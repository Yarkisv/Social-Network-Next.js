"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { initialUser } from "@/app/store/slices/userSlice";
import axiosInstance from "@/lib/axios";

export function HydrateUser({ user }: { user: any }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(initialUser(user));
    } else {
      axiosInstance.get("/auth/me").then((res) => {
        dispatch(initialUser(res.data));
      });
    }
  }, [user]);

  return null;
}

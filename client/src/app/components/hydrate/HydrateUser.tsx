"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { initialUser } from "@/app/store/slices/userSlice";

export function HydrateUser({ user }: { user: any }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initialUser(user));
  }, [user]);

  return null;
}

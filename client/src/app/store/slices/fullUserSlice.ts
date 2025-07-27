import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/app/types/user.type";
import { Post } from "@/app/types/post.type";
import { Subs } from "@/app/types/subs.type";

interface IFullUserData {
  user: User | null;
  posts: Post[];
  subscriptions: Subs[];
  subscribers: Subs[];
}

const initialState: IFullUserData = {
  user: null,
  posts: [],
  subscriptions: [],
  subscribers: [],
};

export const fullUserSlice = createSlice({
  name: "fullUser",

  initialState,
  reducers: {
    initialUser(
      state,
      action: PayloadAction<{
        user: User;
        posts: Post[];
        subscriptions: Subs[];
        subscribers: Subs[];
      }>
    ) {
      state.user = action.payload.user;
      state.posts = action.payload.posts;
      state.subscriptions = action.payload.subscriptions;
      state.subscribers = action.payload.subscribers;
    },
    clearUser(state) {
      state.user = null;
      state.posts = [];
      state.subscriptions = [];
      state.subscribers = [];
    },
  },
});

export const { initialUser, clearUser } = fullUserSlice.actions;
export default fullUserSlice.reducer;

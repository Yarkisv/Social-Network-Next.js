import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface IUserState {
  user_id: number;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  subscribers: number;
  subscriptions: number;
  description: string;
}

const initialState: IUserState = {
  user_id: 0,
  fullname: "",
  username: "",
  email: "",
  phone: "",
  subscribers: 0,
  subscriptions: 0,
  description: "",
};

export const userSlice = createSlice({
  name: "user",

  initialState,
  reducers: {
    initialUser(state, action: PayloadAction<IUserState>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { initialUser } = userSlice.actions;
export default userSlice.reducer;

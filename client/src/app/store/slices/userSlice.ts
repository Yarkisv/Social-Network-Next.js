import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/app/types/user.type";

const initialState: User = {
  user_id: 0,
  fullname: "",
  username: "",
  email: "",
  phone: "",
  subscribers: 0,
  subscriptions: 0,
  description: "",
  avatarBase64: "",
};

export const userSlice = createSlice({
  name: "user",

  initialState,
  reducers: {
    initialUser(state, action: PayloadAction<User>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { initialUser } = userSlice.actions;
export default userSlice.reducer;

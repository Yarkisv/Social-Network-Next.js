import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/app/types/user.type";

interface IUserState {
  user: User | null;
}

const initialState: IUserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",

  initialState,
  reducers: {
    initialUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { initialUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

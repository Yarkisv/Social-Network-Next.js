import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface IModalState {
  isOpen: boolean;
  searchQuery: string;
}

const initialState: IModalState = {
  isOpen: false,
  searchQuery: "",
};

export const modalSlice = createSlice({
  name: "modal",

  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { openModal, closeModal, setSearchQuery } = modalSlice.actions;
export default modalSlice.reducer;

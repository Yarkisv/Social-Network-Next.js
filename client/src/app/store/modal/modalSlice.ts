import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface modalState {
  isOpen: boolean;
  searchQuery: string;
}

const initialState: modalState = {
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

export const selectModalOpen = (state: RootState) => state.modal.isOpen;

export default modalSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IModalState {
  isOpen: boolean;
  isUploadWindowOpen: boolean;
  isPostModalOpen: boolean;
  searchQuery: string;
}

const initialState: IModalState = {
  isOpen: false,
  isUploadWindowOpen: false,
  isPostModalOpen: false,
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
    openUploadPostWindow: (state) => {
      state.isUploadWindowOpen = true;
    },
    closeUploadPostWindow: (state) => {
      state.isUploadWindowOpen = false;
    },
    openPostModalWindow: (state) => {
      state.isPostModalOpen = true;
    },
    closePostModalWindow: (state) => {
      state.isPostModalOpen = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  openUploadPostWindow,
  closeUploadPostWindow,
  openPostModalWindow,
  closePostModalWindow,
  setSearchQuery,
} = modalSlice.actions;
export default modalSlice.reducer;

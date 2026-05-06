import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IModalState {
  isOpen: boolean;
  isUploadWindowOpen: boolean;
  isPostModalOpen: boolean;
  isSubscribersModalOpen: boolean;
  isSubscriptionsModalOpen: boolean;
  isMessageSettingsModalOpen: boolean;
  isPendingSubsModalOpen: boolean;

  searchQuery: string;
  selectedMessageId: number | undefined;
}

const initialState: IModalState = {
  isOpen: false,
  isUploadWindowOpen: false,
  isPostModalOpen: false,
  isSubscribersModalOpen: false,
  isSubscriptionsModalOpen: false,
  isMessageSettingsModalOpen: false,
  isPendingSubsModalOpen: false,
  searchQuery: "",
  selectedMessageId: undefined,
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
    openSubscribersModal: (state) => {
      state.isSubscribersModalOpen = true;
    },
    closeSubscribersModal: (state) => {
      state.isSubscribersModalOpen = false;
    },
    openSubscribtionsModal: (state) => {
      state.isSubscriptionsModalOpen = true;
    },
    closeSubscribtionsModal: (state) => {
      state.isSubscriptionsModalOpen = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    openMessageSettingsModal: (state) => {
      state.isMessageSettingsModalOpen = true;
    },
    closeMessageSettingsModal: (state) => {
      state.isMessageSettingsModalOpen = false;
    },
    setSelectedMessageId: (
      state,
      action: PayloadAction<number | undefined>,
    ) => {
      state.selectedMessageId = action.payload;
    },
    openPendingSubsModal: (state) => {
      state.isPendingSubsModalOpen = true;
    },
    closePendingSubsModal: (state) => {
      state.isPendingSubsModalOpen = false;
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
  openSubscribersModal,
  closeSubscribersModal,
  openSubscribtionsModal,
  closeSubscribtionsModal,
  openMessageSettingsModal,
  closeMessageSettingsModal,
  openPendingSubsModal,
  closePendingSubsModal,
  setSearchQuery,
  setSelectedMessageId,
} = modalSlice.actions;
export default modalSlice.reducer;

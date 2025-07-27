import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import userReducer from "./slices/userSlice";
import fullUserReducer from "./slices/fullUserSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
    fullUser: fullUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

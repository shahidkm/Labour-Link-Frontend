import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userType: string | null;
  isProfileCompleted: boolean | null;
}

const initialState: UserState = {
  userType: null,
  isProfileCompleted: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ userType: string; isProfileCompleted: boolean }>
    ) => {
      state.userType = action.payload.userType;
      state.isProfileCompleted = action.payload.isProfileCompleted;
    },
    clearUser: (state) => {
      state.userType = null;
      state.isProfileCompleted = null;
    },
    updateProfileCompletion: (state, action: PayloadAction<boolean>) => {
      state.isProfileCompleted = action.payload;
    },
  },
});

export const { setUser, clearUser, updateProfileCompletion } = userSlice.actions;
export default userSlice.reducer;
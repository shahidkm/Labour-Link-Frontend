import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userType: string | null;
  isProfileCompleted: boolean | null;
  labourId: string | null;
  labourName: string | null;
  profilePhotoUrl: string | null;
}

const initialState: UserState = {
  userType: null,
  isProfileCompleted: null,
  labourId: null,
  labourName: null,
  profilePhotoUrl: null
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
      console.log("Profile completion status:", action.payload.isProfileCompleted);
    },
    
    setLabourProfile: (
      state,
      action: PayloadAction<{ 
        labourId: string; 
        labourName: string; 
        profilePhotoUrl: string 
      }>
    ) => {
      state.labourId = action.payload.labourId;
      state.labourName = action.payload.labourName;
      state.profilePhotoUrl = action.payload.profilePhotoUrl;
    },
    clearUser: (state) => {
      state.userType = null;
      state.isProfileCompleted = null;
      state.labourId = null;
      state.labourName = null;
      state.profilePhotoUrl = null;
      console.log("Profile cleared, completion status:", null);
    },
    updateProfileCompletion: (state, action: PayloadAction<boolean>) => {
      state.isProfileCompleted = action.payload;
      console.log("Profile completion updated:", action.payload);
    },
  },
});

export const { setUser, setLabourProfile, clearUser, updateProfileCompletion } = userSlice.actions;
export default userSlice.reducer;
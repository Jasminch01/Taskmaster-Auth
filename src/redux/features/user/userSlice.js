import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import auth from "../../../utils/firebase.config";

const initialState = {
  name: "",
  email: "",
  isLoading: true,
  isError: false,
  error: "",
};

export const createUser = createAsyncThunk(
  "userSlice/createUser",
  async ({ name, email, password }) => {
    const data = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {
      displayName: name,
    });
    return {
      name: data.user.displayName,
      email: data.user.email,
    };
  }
);

export const userLogin = createAsyncThunk(
  "userSlice/userLogin",
  async ({ email, password }) => {
    const data = await signInWithEmailAndPassword(auth, email, password);
    console.log(data);
    return;
  }
);
export const googleLogin = createAsyncThunk(
  "userSlice/googleLogin",
  async () => {
    const provider = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, provider);
    console.log(data);
    return;
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      (state.name = payload.name), (state.email = payload.email);
    },
    toggleisLoading: (state) => {
      state.isLoading = false;
    },
    Logout: (state) => {
      (state.name = ""), (state.email = "");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        (state.name = ""), (state.email = "");
        (state.isLoading = true), (state.isError = false), (state.error = "");
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.email = payload.email),
          (state.name = payload.name),
          (state.error = "");
      })
      .addCase(createUser.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.name = ""),
          (state.email = ""),
          (state.error = action.error.message);
      })
      .addCase(userLogin.pending, (state) => {
        (state.name = ""), (state.email = "");
        (state.isLoading = true), (state.isError = false), (state.error = "");
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.email = payload.email),
          (state.name = payload.name),
          (state.error = "");
      })
      .addCase(userLogin.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.name = ""),
          (state.email = ""),
          (state.error = action.error.message);
      })
      .addCase(googleLogin.fulfilled, (state, { payload }) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.email = payload.user.email),
          (state.name = payload.user.displayName);
      });
  },
});

export const { setUser, Logout, toggleisLoading } = userSlice.actions;

export default userSlice.reducer;

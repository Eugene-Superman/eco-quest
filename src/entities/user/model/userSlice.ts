import type { IUser, UserState } from "@/entities/user/model";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { refreshUserData } from "./thunks";

const initialState: UserState = {
	user: null,
	accessToken: null,
	isLoading: false,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<IUser>) => {
			state.user = action.payload;
		},
		setAccessToken: (state, action: PayloadAction<string | null>) => {
			state.accessToken = action.payload;
		},
		resetAll: () => initialState,
	},
	extraReducers: (builder) => {
		builder.addCase(refreshUserData.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(refreshUserData.fulfilled, (state, action) => {
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.isLoading = false;
		});
	},
});

// Action creators are generated for each case reducer function
export const { setUser, setAccessToken, resetAll } = userSlice.actions;

export default userSlice.reducer;

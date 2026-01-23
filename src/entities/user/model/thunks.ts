import { createAsyncThunk } from "@reduxjs/toolkit";
import { requestImitation } from "@/shared/api";
import type { IUser, UserLoginData } from "./userTypes";

const mockUser: IUser = {
	fullname: "Test Smith",
	nickname: "Quasimodo",
	role: "participant",
};

const guestUserState: UserLoginData = {
	user: {
		fullname: "Guest Visitor",
		nickname: "guest",
		role: "visitor",
	},
	accessToken: null,
};

export const refreshUserData = createAsyncThunk(
	"user/refresh-token",
	async (_, api) => {
		const loggedUserState: UserLoginData | null = await requestImitation(null);

		return loggedUserState || guestUserState;
	},
);

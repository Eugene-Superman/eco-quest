export type UserRole = "admin" | "moderator" | "participant" | "visitor";

export interface IUser {
	fullname: string;
	nickname: string;
	role: UserRole;
}

export interface UserLoginData {
	user: IUser;
	accessToken: string | null;
}

export interface UserState {
	user: IUser | null;
	accessToken: string | null;
	isLoading: boolean;
}

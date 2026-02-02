export type UserRole = "admin" | "moderator" | "participant" | "visitor";

export interface IUser {
	fullname?: string;
	nickname: string;
	email: string;
	role: UserRole;
}

export interface UserAccessData {
	user: IUser;
	accessToken: string | null;
}

export interface UserState {
	user: IUser | null;
	accessToken: string | null;
	isLoading: boolean;
}

export type UserRole = 'admin' | 'moderator' | 'participant' | 'visitor';

export interface IUser {
  fullname?: string;
  nickname: string;
  email: string;
  role: UserRole;
}

export interface UserState {
  user?: IUser;
}

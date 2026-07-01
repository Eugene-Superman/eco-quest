import type { IUser } from '@/entities/user';

export interface UserAccessData extends IUser {
  accessToken: string;
}

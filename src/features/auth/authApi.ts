import { http, refreshRequest } from '@/shared/api/http';
import type { ISignupForm } from './signup/signupTypes';
import type { ILoginForm } from './login/loginTypes';
import type { UserAccessData } from './auth.types';

export const authApi = {
  signup: (data: Omit<ISignupForm, 'repeatPassword'>) =>
    http.post<UserAccessData, Omit<ISignupForm, 'repeatPassword'>>('auth/signup', data, {}, false),
  signin: (data: ILoginForm) =>
    http.post<UserAccessData, ILoginForm>('auth/signin', data, {}, false),
  logout: () => http.post('auth/logout', {}),
  refresh: refreshRequest,
};

import { http } from '@/shared/api/http';
import type { ISignupForm } from './signup/signupTypes';
import type { ILoginForm } from './login/loginTypes';
import type { UserAccessData } from '@/entities/user';

export const authApi = {
  signup: (data: Omit<ISignupForm, 'repeatPassword'>) =>
    http.post<UserAccessData, Omit<ISignupForm, 'repeatPassword'>>('signup', data, {}, false),
  signin: (data: ILoginForm) => http.post<UserAccessData, ILoginForm>('signin', data, {}, false),
};

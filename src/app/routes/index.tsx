import { ROUTES } from '@/shared/config';
import { HomePage } from '@/pages/home';
import { BrowserRouter, Route, Routes } from 'react-router';
import AppLayout from '../layouts/AppLayout';
import { LoginPage } from '@/pages/login';
import { SignupPage } from '@/pages/signup';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGN_UP} element={<SignupPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

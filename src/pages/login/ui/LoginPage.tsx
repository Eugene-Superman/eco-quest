import LoginForm from '@/features/auth/login/LoginForm';
import { ROUTES } from '@/shared/config';
import { useNavigate } from 'react-router';

export default function LoginPage() {
  const navigate = useNavigate();
  const redirectToHome = () => navigate(ROUTES.HOME);

  return (
    <div>
      <h2>Log in</h2>
      <LoginForm onSubmitSuccess={redirectToHome} />
    </div>
  );
}

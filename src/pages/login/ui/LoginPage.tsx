import LoginForm from '@/features/auth/login/LoginForm';
import { AuthCard } from '@/features/auth';
import { ROUTES } from '@/shared/config';
import { Link, useNavigate } from 'react-router';

export default function LoginPage() {
  const navigate = useNavigate();
  const redirectToHome = () => navigate(ROUTES.HOME);

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue your eco quest"
      footer={
        <>
          Don&apos;t have an account? <Link to={ROUTES.SIGN_UP}>Sign up</Link>
        </>
      }
    >
      <LoginForm onSubmitSuccess={redirectToHome} />
    </AuthCard>
  );
}

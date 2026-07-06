import SignupForm from '@/features/auth/signup/SignupForm';
import { AuthCard } from '@/features/auth';
import { ROUTES } from '@/shared/config';
import { Link, useNavigate } from 'react-router';

export default function SignupPage() {
  const navigate = useNavigate();
  const redirectToHome = () => navigate(ROUTES.HOME);

  return (
    <AuthCard
      title="Join Eco Quest"
      subtitle="Create an account and start making an impact"
      footer={
        <>
          Already have an account? <Link to={ROUTES.LOGIN}>Log in</Link>
        </>
      }
    >
      <SignupForm onSubmitSuccess={redirectToHome} />
    </AuthCard>
  );
}

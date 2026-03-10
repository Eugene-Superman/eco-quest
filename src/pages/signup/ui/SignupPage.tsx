import SignupForm from '@/features/auth/signup/SignupForm';
import { ROUTES } from '@/shared/config';
import { useNavigate } from 'react-router';

export default function SignupPage() {
  const navigate = useNavigate();
  const redirectToHome = () => navigate(ROUTES.HOME);

  return (
    <div>
      <h2>Sing Up</h2>
      <SignupForm onSubmitSuccess={redirectToHome} />
    </div>
  );
}

import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { initChallengeDetails } from '../model';
import { ROUTES } from '@/shared/config';
import { Preloader } from '@/shared/ui/Preloader';

export default function DetailedPage() {
  const listReqState = useAppSelector((state) => state.challenges.listReqState);
  const challengesList = useAppSelector((state) => state.challenges.challengesList);
  const selectedReqState = useAppSelector((state) => state.challenges.selectedReqState);
  const selectedChallenge = useAppSelector((state) => state.challenges.selectedChallenge);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(initChallengeDetails(id));
    } else {
      navigate(ROUTES.CHALLENGES, { replace: true });
    }
  }, []);

  return (
    <div>
      <h2>DetailedPage</h2>
      <Preloader status={listReqState}>content</Preloader>
    </div>
  );
}

import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { useEffect } from 'react';
import { getChallengesList, resetAllChallengesStore } from '../../model';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/shared/config';
import { Preloader } from '@/shared/ui/Preloader';

export default function ChallengesPage() {
  const listReqState = useAppSelector((state) => state.challenges.listReqState);
  const challengesList = useAppSelector((state) => state.challenges.challengesList);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getChallengesList());
  }, []);

  const handleChallengeClick = (id: string) => {
    dispatch(resetAllChallengesStore());
    navigate(ROUTES.CHALLENGE_DETAILS(id));
  };

  return (
    <div>
      <Preloader status={listReqState}>
        {challengesList.length ? (
          challengesList.map(({ id, name, description }) => (
            <div key={id} onClick={() => handleChallengeClick(id)}>
              {name}, {description}
            </div>
          ))
        ) : (
          <p>No data</p>
        )}
      </Preloader>
    </div>
  );
}

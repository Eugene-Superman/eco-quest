import './styles/App.css';
import AppRouter from './routes';
import { useEffect } from 'react';
import { refreshUserData } from '@/entities/user/model';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { Loader } from '@/shared/ui';

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.user.isLoading);

  useEffect(() => {
    dispatch(refreshUserData());
  }, []);

  return isLoading ? <Loader /> : <AppRouter />;
}

export default App;

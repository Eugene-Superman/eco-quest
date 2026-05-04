import './styles/App.css';
import AppRouter from './routes';
import { useEffect } from 'react';
import { refreshUserData } from '@/entities/user';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { Loader } from '@/shared/ui';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshUserData());
  }, []);

  return <AppRouter />;
}

export default App;

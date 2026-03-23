import type { RequestState } from '../api';
import { Loader } from './Loader';

interface Props {
  status: RequestState;
  children: React.ReactNode;
}

const shouldLoad = (s: RequestState) => ['none', 'request'].includes(s);

export function Preloader({ status, children }: Props) {
  if (shouldLoad(status)) {
    return <Loader />;
  }

  return children;
}

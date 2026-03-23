import type { DateTimeStamp } from '@/shared/types';

export interface IChallenge {
  id: string;
  name: string;
  city: string;
  description: string;
  author: string;
  term?: DateTimeStamp;
  reward: number;
}

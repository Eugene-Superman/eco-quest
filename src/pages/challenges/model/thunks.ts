import { createAsyncThunk } from '@reduxjs/toolkit';
import { requestImitation } from '@/shared/api';
import type { IChallenge } from './types';

const mocks: IChallenge[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i),
  name: `Challenge ${i}`,
  city: 'Warsaw',
  description: 'Mock description' + i,
  author: 'Admin',
  reward: 1 + i,
}));

export const getChallengesList = createAsyncThunk('challenges/get-list', async (_, api) => {
  const result = await requestImitation(mocks);

  return result;
});

export const getChallengeDetails = createAsyncThunk(
  'challenges/get-details',
  async (challengeId: string, api) => {
    const result = await requestImitation(mocks[0]);

    return result;
  },
);

export const initChallengeDetails = createAsyncThunk(
  'challenges/get-details',
  async (challengeId: string, { dispatch }) => {
    dispatch(getChallengesList());
    dispatch(getChallengeDetails(challengeId));
  },
);

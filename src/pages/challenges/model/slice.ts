import { createSlice } from '@reduxjs/toolkit';
import { getChallengeDetails, getChallengesList } from './thunks';
import type { IChallenge } from './types';
import type { RequestState } from '@/shared/api';

interface IState {
  // List fields
  listReqState: RequestState;
  challengesList: IChallenge[];
  // Details fields
  selectedReqState: RequestState;
  selectedChallenge?: IChallenge;
}

const initialState: IState = {
  // List fields
  listReqState: 'none',
  challengesList: [],
  // Details fields,
  selectedReqState: 'none',
};

export const slice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    resetAll: () => initialState,
  },
  extraReducers: (builder) => {
    // Get Challenges List
    builder.addCase(getChallengesList.pending, (state) => {
      state.listReqState = 'request';
    });
    builder.addCase(getChallengesList.fulfilled, (state, action) => {
      state.challengesList.push(...action.payload);
      state.listReqState = 'success';
    });
    builder.addCase(getChallengesList.rejected, (state) => {
      state.listReqState = 'failure';
    });
    // Get Challenge Details
    builder.addCase(getChallengeDetails.pending, (state) => {
      state.selectedReqState = 'request';
    });
    builder.addCase(getChallengeDetails.fulfilled, (state, action) => {
      state.selectedChallenge = action.payload;
      state.selectedReqState = 'success';
    });
    builder.addCase(getChallengeDetails.rejected, (state) => {
      state.selectedReqState = 'failure';
    });
  },
});

export const { resetAll: resetAllChallengesStore } = slice.actions;

export default slice.reducer;

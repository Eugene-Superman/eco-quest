import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CreateNotification, NotificationsState } from './notificationsTypes';
import { generateId } from '@/shared/lib/utils';

const initialState: NotificationsState = {
  notificationList: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<CreateNotification>) {
      state.notificationList.push({ id: generateId(), ...action.payload });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notificationList = state.notificationList.filter((n) => n.id !== action.payload);
    },
    resetAllNotifications(state) {
      state = initialState;
    },
  },
});

export const { addNotification, removeNotification, resetAllNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;

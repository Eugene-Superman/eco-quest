import { refreshUserData } from '@/entities/user/model';
import { accessTokenProvider } from '@/shared/api/accessTokenProvider';
import { createListenerMiddleware } from '@reduxjs/toolkit';

const tokenListenerMiddleware = createListenerMiddleware();

tokenListenerMiddleware.startListening({
  actionCreator: refreshUserData.fulfilled,
  effect: (action) => {
    const { accessToken } = action.payload;
    if (accessToken && accessToken !== accessTokenProvider.getToken())
      accessTokenProvider.setToken(accessToken);
  },
});

export { tokenListenerMiddleware };

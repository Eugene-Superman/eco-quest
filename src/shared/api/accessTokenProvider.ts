let accessToken: string | null = null;

export const accessTokenProvider = {
  setToken: (token: string) => {
    accessToken = token;
  },
  getToken: () => accessToken,
  clear: () => {
    accessToken = null;
  },
};

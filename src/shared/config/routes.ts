export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  FORBIDDEN: '/forbidden',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  CHALLENGES: '/challenges',
  CHALLENGE_DETAILS: (id = ':id') => '/challenge-details/' + id,
};

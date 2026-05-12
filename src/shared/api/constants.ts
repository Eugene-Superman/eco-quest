export const CONSTANTS = {
  MAX_REFETCH_ATTEMPTS: 3,
  BASE_TIMEOUT: 500,
  SERVER_ERROR: 'ServerError',
  CLIENT_ERROR: 'ClientError',
  UNAUTHORIZED_ERROR: 'UnauthorizedError',
  // SocketClient
  MAX_SEND_QUEUE: 50,
  HEART_BEAT_INTERVAL: 60000,
  PONG_TIMEOUT: 10000,
  HEARTBEAT_PING: JSON.stringify({ type: 'ping' }),
};

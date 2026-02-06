import { CONSTANTS } from './constants';
const MAX_SEND_QUEUE = 50;
const HEART_BEAT_INTERVAL = 60000;
const PONG_TIMEOUT = 10000;
const HEARTBEAT_PING = JSON.stringify({ type: 'ping' });

type SocketEvent = keyof WebSocketEventMap;

type SocketState =
  | 'idle'
  | 'connecting'
  | 'open'
  | 'intentional-closing'
  | 'reconnecting'
  | 'closed';

interface EventHandler {
  open: () => void;
  message: (data: unknown) => void;
  error: (event: unknown) => void;
  close: (event: CloseEvent) => void;
}

const isPong = (data: unknown) =>
  !!(data && typeof data === 'object' && 'type' in data && data.type === 'pong');

class SocketClient {
  #websocket: null | WebSocket = null;
  #url;
  #eventHandlers: { [K in SocketEvent]: EventHandler[K][] } = {
    open: [],
    message: [],
    error: [],
    close: [],
  };
  #retryCounter = 0;
  #retryTimeout: number | null = null;
  #state: SocketState = 'idle';
  #sendQueue: string[] = [];
  #pingInterval: number | null = null;
  #pongTimeout: number | null = null;

  constructor(url: string) {
    this.#url = url;
  }

  on<K extends SocketEvent>(event: K, handler: EventHandler[K]) {
    this.#eventHandlers[event].push(handler);

    return () => this.off(event, handler);
  }

  off<K extends SocketEvent>(event: K, handler: EventHandler[K]) {
    (this.#eventHandlers[event] as EventHandler[K][]) = this.#eventHandlers[event].filter(
      (h) => h !== handler,
    );
  }

  #setState(newState: SocketState) {
    this.#state = newState;
  }
  isOpened() {
    return this.#state === 'open';
  }
  isConnecting() {
    return this.#state === 'connecting';
  }
  open() {
    if (this.isOpened() || this.isConnecting()) {
      return;
    }
    this.#setState('connecting');
    this.#websocket = new WebSocket(this.#url);
    this.#websocket.addEventListener('open', () => {
      this.#eventHandlers.open.forEach((handler) => handler());

      if (this.#sendQueue.length) {
        this.#sendQueue.forEach((message) => this.#websocket?.send(message));
        this.#sendQueue = [];
      }

      this.resetRetry();
      this.#setState('open');
      this.#startPing();
    });

    this.#websocket.addEventListener('error', (error) => {
      this.#eventHandlers.error.forEach((handler) => handler(error));
    });

    this.#websocket.addEventListener('message', (event) => {
      let data: unknown = event.data;
      try {
        data = JSON.parse(event.data);
      } catch (parseError) {
        this.#eventHandlers.error.forEach((handler) => handler(parseError));
        return;
      }

      if (isPong(data)) {
        return this.#clearPongTimeout();
      }

      this.#eventHandlers.message.forEach((handler) => handler(data));
    });

    this.#websocket.addEventListener('close', (event) => {
      this.#eventHandlers.close.forEach((handler) => handler(event));

      this.#websocket = null;

      if (
        this.#state !== 'intentional-closing' &&
        !event.wasClean &&
        this.#retryCounter < CONSTANTS.MAX_REFETCH_ATTEMPTS
      ) {
        this.reconnect();
      }

      this.#setState('closed');
      this.#stopPing();
    });
  }
  #onPingTimeout() {
    this.reconnect();
  }
  #startPing() {
    this.#stopPing();
    this.#pingInterval = setInterval(() => {
      this.send(HEARTBEAT_PING);

      this.#clearPongTimeout();
      this.#pongTimeout = setTimeout(() => this.#onPingTimeout(), PONG_TIMEOUT);
    }, HEART_BEAT_INTERVAL);
  }
  #stopPing() {
    if (this.#pingInterval) {
      clearInterval(this.#pingInterval);
      this.#pingInterval = null;
    }

    this.#clearPongTimeout();
  }
  #clearPongTimeout() {
    if (this.#pongTimeout) {
      clearTimeout(this.#pongTimeout);
      this.#pongTimeout = null;
    }
  }
  reconnect() {
    this.#setState('reconnecting');
    const jitterTimeout =
      CONSTANTS.BASE_TIMEOUT * 2 ** ++this.#retryCounter + Math.floor(Math.random() * 1000);
    return (this.#retryTimeout = setTimeout(() => this.open(), jitterTimeout));
  }
  close() {
    this.#setState('intentional-closing');
    this.#websocket?.close();

    this.resetRetry();
  }
  send(message: string) {
    if (!this.isOpened()) {
      if (this.#sendQueue.length >= MAX_SEND_QUEUE) {
        this.#sendQueue.shift();
      }
      return this.#sendQueue.push(message);
    }

    this.#websocket?.send(message);
  }

  resetRetry() {
    if (this.#retryCounter) {
      this.#retryCounter = 0;
    }

    if (this.#retryTimeout) {
      clearTimeout(this.#retryTimeout);
      this.#retryTimeout = null;
    }
  }
}

export { SocketClient };

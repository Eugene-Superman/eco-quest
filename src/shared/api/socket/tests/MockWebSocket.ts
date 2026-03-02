import { vi } from 'vitest';

type SocketListener<K extends keyof WebSocketEventMap> = (event: WebSocketEventMap[K]) => void;

export class MockWebSocket {
  public url;
  static instances: MockWebSocket[] = [];
  #events: Partial<Record<keyof WebSocketEventMap, Function[]>> = {};
  send = vi.fn();

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: SocketListener<K>) {
    if (!this.#events[type]) {
      this.#events[type] = [listener];
      return;
    }

    this.#events[type].push(listener);
  }

  #emit<K extends keyof WebSocketEventMap>(eventKey: K, event: WebSocketEventMap[K]) {
    this.#events[eventKey]?.forEach((handler) => handler(event));
  }

  mockOpen() {
    this.#emit('open', new Event('open'));
  }
  mockSend(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    this.#emit('message', new MessageEvent('message', { data: JSON.stringify(data) }));
  }
  mockSendWrongJson(data: any) {
    this.#emit('message', new MessageEvent('message', { data }));
  }
  mockError() {
    this.#emit('error', new ErrorEvent('error'));
  }
  mockClose(code = 1000, reason = 'normal', wasClean = true) {
    this.#emit('close', new CloseEvent('close', { code, reason, wasClean }));
  }
  close(code?: number, reason?: string) {
    this.mockClose(code, reason);
    this.#events = {};
  }
}

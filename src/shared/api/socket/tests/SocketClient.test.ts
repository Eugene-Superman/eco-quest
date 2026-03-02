import { muteConsole } from '@/shared/lib/test';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { MockWebSocket } from './MockWebSocket';
import { SocketClient } from '../SocketClient';
import { CONSTANTS } from '../../constants';

vi.useFakeTimers();
vi.stubGlobal('WebSocket', MockWebSocket);

beforeEach(() => {
  vi.clearAllMocks();
  MockWebSocket.instances = [];
});

describe('SocketClient', () => {
  let cleanUpMuteConsole: null | (() => void) = null;

  beforeAll(() => (cleanUpMuteConsole = muteConsole()));
  afterAll(() => cleanUpMuteConsole?.());

  it('Opens connection', () => {
    const client = new SocketClient('ws://test');
    const onOpen = vi.fn();
    client.on('open', onOpen);
    client.open();

    const mockedWebSocket = MockWebSocket.instances[0];
    mockedWebSocket.mockOpen();

    expect(onOpen).toHaveBeenCalled();
    expect(client.isOpened()).toBe(true);
  });

  it('Sends message', () => {
    const client = new SocketClient('ws://test');
    const firstTestMessage = 'First test';
    const secondTestMessage = 'Second test';

    client.send(firstTestMessage);
    client.send(secondTestMessage);
    client.open();

    const mockedWebSocket = MockWebSocket.instances[0];
    mockedWebSocket.mockOpen();

    expect(mockedWebSocket.send).toHaveBeenCalledWith(firstTestMessage);
    expect(mockedWebSocket.send).toHaveBeenCalledWith(secondTestMessage);
  });

  it('Gets message', () => {
    const client = new SocketClient('ws://test');
    const onMessage = vi.fn();
    const testMessage = 'Test Text';

    client.on('message', onMessage);
    client.open();

    const mockedWebSocket = MockWebSocket.instances[0];
    mockedWebSocket.mockOpen();
    mockedWebSocket.mockSend(testMessage);

    expect(onMessage).toHaveBeenCalledWith(testMessage);
  });

  it('Closes connection', () => {
    const client = new SocketClient('ws://test');
    const onClose = vi.fn();

    client.on('close', onClose);
    client.open();

    const mockedWebSocket = MockWebSocket.instances[0];
    mockedWebSocket.mockOpen();
    mockedWebSocket.mockClose();

    expect(onClose).toHaveBeenCalled();
    expect(client.isOpened()).toBe(false);
  });

  it('Handles Error', () => {
    const client = new SocketClient('ws://test');
    const onError = vi.fn();

    client.on('error', onError);
    client.open();

    const mockedWebSocket = MockWebSocket.instances[0];
    mockedWebSocket.mockOpen();
    mockedWebSocket.mockError();

    expect(onError).toHaveBeenCalled();
  });

  it('Handles Wrong JSON Error', () => {
    const client = new SocketClient('ws://test');
    const onError = vi.fn();

    client.on('error', onError);
    client.open();

    const mockedWebSocket = MockWebSocket.instances[0];
    mockedWebSocket.mockOpen();
    mockedWebSocket.mockSendWrongJson('Is not json');

    expect(onError).toHaveBeenCalled();
  });

  it('Sends ping and reconnects on pong timeout', () => {
    const client = new SocketClient('ws://test');
    client.open();

    const mockedWebSocket = MockWebSocket.instances[0];
    mockedWebSocket.mockOpen();

    vi.advanceTimersByTime(CONSTANTS.HEART_BEAT_INTERVAL);
    expect(mockedWebSocket.send).toHaveBeenCalledWith(CONSTANTS.HEARTBEAT_PING);

    vi.advanceTimersByTime(CONSTANTS.PONG_TIMEOUT);
    expect(client.isConnecting()).toBe(true);
  });
});

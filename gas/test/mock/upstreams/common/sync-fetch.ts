import nodeFetch from 'node-fetch';
import { Readable } from 'stream';

export type SyncRequestInit = {
  body?: nodeFetch.BodyInit;
  headers?: nodeFetch.HeadersInit;
  method?: string;
  redirect?: nodeFetch.RequestRedirect;
  compress?: boolean;
  follow?: number;
  size?: number;
  timeout?: number;
};

export type SyncRequest = (
  url: SyncRequestInfo,
  init?: SyncRequestInit
) => SyncResponse;

type URLLike = { href: string };
type ResponseType = nodeFetch.ResponseType;
type SyncBodyInit = string | ArrayBuffer | ArrayBufferView | URLSearchParams;
export type SyncRequestInfo = string | URLLike | SyncRequest;

abstract class SyncBody {
  protected bodyBuffer: Buffer | null;
  bodyUsed = false;
  size: number;
  timeout: number;

  constructor(
    body?: SyncBodyInit,
    opts: { size?: number; timeout?: number } = {}
  ) {
    this.size = opts.size || 0;
    this.timeout = opts.timeout || 0;
    if (body) {
      if (body instanceof Buffer) {
        this.bodyBuffer = body;
      } else if (typeof body === 'string') {
        this.bodyBuffer = Buffer.from(body, 'utf-8');
      } else {
        throw new TypeError('Unsupported body type');
      }
    } else {
      this.bodyBuffer = null;
    }
  }

  text = (): string => {
    if (this.bodyUsed) throw new Error('Body has already been used');
    this.bodyUsed = true;
    return this.bodyBuffer ? this.bodyBuffer.toString('utf-8') : '';
  };

  json = (): any => {
    return JSON.parse(this.text());
  };

  arrayBuffer = (): ArrayBuffer => {
    return Buffer.from(this.text()).buffer;
  };

  buffer = (): Buffer => {
    return Buffer.from(this.text());
  };
}

export class SyncResponse extends SyncBody {
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;

  constructor(body?: SyncBodyInit, init: ResponseInit = {}) {
    super(body, { size: 0, timeout: 0 });

    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.ok = this.status >= 200 && this.status < 300;
    this.redirected = false;
    this.type = 'default';
    this.headers = new Headers(init.headers);
    this.url = '';
  }

  clone = (): SyncResponse => {
    return new SyncResponse(this.bodyBuffer ? this.text() : '', {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
    });
  };
}

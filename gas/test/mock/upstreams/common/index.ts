import querystring from 'querystring';

import { List, Map } from 'immutable';

import { Status } from '@/aspects/http';
import { SyncRequestInit, SyncResponse } from './sync-fetch';

export const Type = {
  OK: 'ok',
  BAD_REQUEST: 'bad_request',
  NOT_FOUND: 'not_found',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  CONFLICT: 'conflict',
  INTERNAL_SERVER_ERROR: 'internal_server_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
} as const;

export type Type = (typeof Type)[keyof typeof Type];

export abstract class Resource<T, O extends object, Q extends object> {
  public constructor(
    protected readonly type: T,
    protected readonly overrides: O
  ) {}

  // リクエストを実行し、レスポンスを生成する
  public handle(uri: string, options?: SyncRequestInit): SyncResponse {
    if (!this.matches(uri, options)) {
      throw new Error('Request not match.');
    }

    return this.createResponse(uri, options);
  }

  public parseQuery(uri: string): Q {
    return querystring.parse(uri.substring(uri.indexOf('?') + 1)) as Q;
  }

  // 自身を一意に識別する文字列を生成する
  public abstract code(): string;

  // リクエストが自身へのものかどうか判定する
  public abstract matches(uri: string, options?: SyncRequestInit): boolean;

  public abstract content(): string;

  // 正常系レスポンスを生成する
  protected abstract createSuccessfulResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse;

  protected createBadRequestResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse {
    return new SyncResponse('', { status: Status.BAD_REQUEST });
  }

  protected createNotFoundResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse {
    return new SyncResponse('', { status: Status.NOT_FOUND });
  }

  protected createUnauthorizedResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse {
    return new SyncResponse('', { status: Status.UNAUTHORIZED });
  }

  protected createForbiddenResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse {
    return new SyncResponse('', { status: Status.FORBIDDEN });
  }

  protected createConflictResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse {
    return new SyncResponse('', { status: Status.CONFLICT });
  }

  protected createInternalServerErrorResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse {
    return new SyncResponse('', { status: Status.INTERNAL_SERVER_ERROR });
  }

  protected createServiceUnavailableResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse {
    return new SyncResponse('', { status: Status.SERVICE_UNAVAILABLE });
  }

  // リソース固有のレスポンス種別に応じたレスポンスを生成するメソッドは「任意」の要素なのでデフォルト実装を用意しておく
  protected createCustomResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse | null {
    return null;
  }

  protected createResponse(
    uri: string,
    options?: SyncRequestInit,
    data?: object
  ): SyncResponse {
    switch (this.type) {
      case Type.OK:
        return this.createSuccessfulResponse(uri, options);

      case Type.BAD_REQUEST:
        return this.createBadRequestResponse(uri, options);

      case Type.NOT_FOUND:
        return this.createNotFoundResponse(uri, options);

      case Type.UNAUTHORIZED:
        return this.createUnauthorizedResponse(uri, options);

      case Type.FORBIDDEN:
        return this.createForbiddenResponse(uri, options);

      case Type.CONFLICT:
        return this.createConflictResponse(uri, options);

      case Type.SERVICE_UNAVAILABLE:
        return this.createServiceUnavailableResponse(uri, options);

      case Type.INTERNAL_SERVER_ERROR:
        return this.createInternalServerErrorResponse(uri, options);
    }

    return (
      this.createCustomResponse(uri, options) ??
      new SyncResponse('Internal server error.', { status: 500 })
    );
  }
}

export abstract class Upstream {
  private resources: Map<string, Resource<any, object, object>>;

  public constructor(public readonly endpoint: string) {
    this.resources = Map();
  }

  // リクエストを実行する
  public handle(url: string, options?: SyncRequestInit): SyncResponse {
    const uri = url.replace(new RegExp(`^${this.endpoint}`), '');
    const resource = this.resources.find(resource =>
      resource.matches(uri, options)
    );

    if (!resource) {
      return new SyncResponse('Not found.', { status: 404 });
    }

    return resource.handle(uri, options);
  }

  // リソースを追加する
  protected add<T, O extends object, Q extends object>(
    resource: Resource<T, O, Q>
  ): void {
    this.resources = this.resources.set(resource.code(), resource);
  }

  protected addAll<T, O extends object, Q extends object>(
    ...resources: Resource<T, O, Q>[]
  ): void {
    resources.forEach(resource => this.add(resource));
  }
}

/**
 * 複数のupstreamモックを単一のモック関数に束ねるユーティリティ
 */
export const UpstreamRouter = (...upstreams: Upstream[]) => {
  return (uri: string, options?: SyncRequestInit) => {
    const route = upstreams.find(route => uri.startsWith(route.endpoint));

    if (!route) {
      // エンドポイントが一致するものがなければエラーとする
      throw new Error('Request url is not found.');
    }

    return route.handle(uri, options);
  };
};

export let mockUpstream: Upstream | null = null;

export const inject = (upstream: Upstream): void => {
  mockUpstream = upstream;
};

export abstract class Media<T extends object, M extends object> {
  protected readonly _data: Required<T>;

  public constructor(protected readonly overrides?: T | M) {
    this._data = this.fill(overrides);
  }

  public data(): Required<T> {
    return this._data;
  }

  public abstract createSuccessfulContent(): string;

  public abstract createFailureContent(): string;

  protected abstract fillByModel(overrides: M): T;

  protected abstract isModel(overrides: T | M): overrides is M;

  protected abstract fill(overrides?: T | M): Required<T>;
}

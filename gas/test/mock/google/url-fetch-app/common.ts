import { BlobMock, HttpResponseMock } from './response';
import { mockUpstream } from '../../upstreams/common';
import {
  SyncRequestInit,
  SyncResponse,
} from 'test/mock/upstreams/common/sync-fetch';

export class UrlFetchAppMock implements GoogleAppsScript.URL_Fetch.UrlFetchApp {
  fetch(
    url: string,
    params?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
  ): GoogleAppsScript.URL_Fetch.HTTPResponse {
    const convertBody = (body: GoogleAppsScript.URL_Fetch.Payload): string => {
      if (typeof body === 'string') {
        return body;
      }

      if (body instanceof BlobMock) {
        throw new Error('Blob is not supported');
      }

      const params = new URLSearchParams(body as Record<string, string>);

      return params.toString();
    };

    const init: SyncRequestInit = {
      method: params?.method,
      headers: params?.headers,
      body: params?.payload ? convertBody(params.payload) : undefined,
    };

    if (!mockUpstream) {
      return new HttpResponseMock(
        new SyncResponse('Not Found', { status: 404 })
      );
    }

    const response = mockUpstream.handle(url, init);

    return new HttpResponseMock(response);
  }

  fetchAll(
    requests: Array<GoogleAppsScript.URL_Fetch.URLFetchRequest | string>
  ): GoogleAppsScript.URL_Fetch.HTTPResponse[] {
    return requests.map(request => {
      if (typeof request === 'string') {
        return this.fetch(request);
      }
      return this.fetch(request.url, request);
    });
  }

  getRequest(
    url: unknown,
    params?: unknown
  ): GoogleAppsScript.URL_Fetch.URLFetchRequest {
    return {
      url: url as string,
      ...(params as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions),
    };
  }
}

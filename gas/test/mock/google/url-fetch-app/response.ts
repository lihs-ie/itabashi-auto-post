import { SyncResponse } from 'test/mock/upstreams/common/sync-fetch';

export class BlobMock implements GoogleAppsScript.Base.Blob {
  constructor(private readonly source: Promise<Blob>) {}

  copyBlob(): GoogleAppsScript.Base.Blob {
    return this;
  }

  getAs(): GoogleAppsScript.Base.Blob {
    return this;
  }

  getBytes(): GoogleAppsScript.Byte[] {
    return [];
  }

  getContentType(): string | null {
    return null;
  }

  getDataAsString(): string {
    return '';
  }

  getName(): string | null {
    return null;
  }

  isGoogleType(): boolean {
    return false;
  }

  setBytes(): GoogleAppsScript.Base.Blob {
    return this;
  }

  setContentType(): GoogleAppsScript.Base.Blob {
    return this;
  }

  setContentTypeFromExtension(): GoogleAppsScript.Base.Blob {
    return this;
  }

  setDataFromString(): GoogleAppsScript.Base.Blob {
    return this;
  }

  setName(): GoogleAppsScript.Base.Blob {
    return this;
  }

  getAllBlobs(): GoogleAppsScript.Base.Blob[] {
    return [];
  }

  getBlob(): GoogleAppsScript.Base.Blob {
    return this;
  }
}

export class HttpResponseMock
  implements GoogleAppsScript.URL_Fetch.HTTPResponse
{
  constructor(private readonly response: SyncResponse) {}

  getAllHeaders(): object {
    const headers: Record<string, string> = {};
    this.response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  getContent(): GoogleAppsScript.Byte[] {
    return [];
  }

  getBlob(): GoogleAppsScript.Base.Blob {
    throw new Error('Not implemented');
  }

  getContentText(): string {
    return this.response.text();
  }

  getHeaders(): object {
    return this.getAllHeaders();
  }

  getResponseCode(): number {
    return this.response.status;
  }

  getAs(): GoogleAppsScript.Base.Blob {
    throw new Error('Not implemented');
  }
}

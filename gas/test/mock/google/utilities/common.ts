import { sha256 } from 'hash.js';
import { v7 } from 'uuid';

enum Charset {
  US_ASCII,
  UTF_8,
}

enum DigestAlgorithm {
  MD2,
  MD5,
  SHA_1,
  SHA_256,
  SHA_384,
  SHA_512,
}

enum MacAlgorithm {
  HMAC_MD5,
  HMAC_SHA_1,
  HMAC_SHA_256,
  HMAC_SHA_384,
  HMAC_SHA_512,
}

enum RsaAlgorithm {
  RSA_SHA_1,
  RSA_SHA_256,
}

export class UtilitiesMock implements GoogleAppsScript.Utilities.Utilities {
  Charset: typeof GoogleAppsScript.Utilities.Charset;
  DigestAlgorithm: typeof GoogleAppsScript.Utilities.DigestAlgorithm;
  MacAlgorithm: typeof GoogleAppsScript.Utilities.MacAlgorithm;
  RsaAlgorithm: typeof GoogleAppsScript.Utilities.RsaAlgorithm;

  constructor() {
    this.Charset = Charset as any;
    this.DigestAlgorithm = DigestAlgorithm as any;
    this.MacAlgorithm = MacAlgorithm as any;
    this.RsaAlgorithm = RsaAlgorithm as any;
  }

  base64Decode(encoded: unknown, charset?: unknown): number[] {
    return btoa(encoded as string)
      .split('')
      .map(c => c.charCodeAt(0));
  }

  base64DecodeWebSafe(encoded: unknown, charset?: unknown): number[] {
    throw new Error('Not implemented');
  }

  base64Encode(data: unknown, charset?: unknown): string {
    return btoa(data as string);
  }

  base64EncodeWebSafe(data: unknown, charset?: unknown): string {
    throw new Error('Not implemented');
  }

  computeDigest(
    algorithm: unknown,
    value: unknown,
    charset?: unknown
  ): number[] {
    return Array.from(sha256().update(value).digest());
  }

  computeHmacSha256Signature(
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Not implemented');
  }

  computeHmacSignature(
    algorithm: unknown,
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Not implemented');
  }

  computeRsaSha1Signature(
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Not implemented');
  }

  computeRsaSha256Signature(
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Not implemented');
  }

  formatDate(date: Date, timeZone: string, format: string): string {
    throw new Error('Not implemented');
  }

  newBlob(data: unknown): GoogleAppsScript.Base.Blob {
    throw new Error('Not implemented');
  }

  parseDate(date: string, timeZone: string, format: string): Date {
    throw new Error('Not implemented');
  }

  sleep(milliseconds: number): void {
    const timer = setTimeout(() => {}, milliseconds);
    return clearTimeout(timer);
  }

  getUuid(): string {
    return v7();
  }

  gzip(blob: GoogleAppsScript.Base.BlobSource): GoogleAppsScript.Base.Blob {
    throw new Error('Not implemented');
  }

  ungzip(blob: GoogleAppsScript.Base.BlobSource): GoogleAppsScript.Base.Blob {
    throw new Error('Not implemented');
  }

  computeRsaSignature(
    algorithm: unknown,
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Not implemented');
  }

  formatString(template: string, ...args: any[]): string {
    throw new Error('Not implemented');
  }

  zip(
    blobs: GoogleAppsScript.Base.BlobSource[],
    name?: string
  ): GoogleAppsScript.Base.Blob {
    throw new Error('Not implemented');
  }

  unzip(blob: GoogleAppsScript.Base.BlobSource): GoogleAppsScript.Base.Blob[] {
    throw new Error('Not implemented');
  }

  jsonParse(jsonString: string): any {
    throw new Error('Not implemented');
  }

  jsonStringify(obj: any): string {
    throw new Error('Not implemented');
  }

  parseCsv(csv: string, delimiter?: string): string[][] {
    throw new Error('Not implemented');
  }
}

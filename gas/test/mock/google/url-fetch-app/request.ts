import syncFetch from 'sync-fetch';
import nodeFetch from 'node-fetch';

const convertHeaders = (
  headers: RequestInit['headers']
): nodeFetch.HeadersInit => {
  return Object.entries(headers as Record<string, string>).map(
    ([key, value]) => [key, value]
  );
};

const restoreHeaders = (headers: nodeFetch.Headers): Headers => {
  const result: Headers = new Headers();

  headers.forEach((value, key) => {
    result.append(key, value);
  });

  return result;
};

export const fetchSync = (url: string, options?: RequestInit): Response => {
  const response = syncFetch(url, {
    method: options?.method,
    headers: options?.headers ? convertHeaders(options.headers) : undefined,
    body: String(options?.body),
  });

  const headers = response.headers;

  return new Response(String(response.body), {
    status: response.status,
    statusText: response.statusText,
    headers: restoreHeaders(headers),
  });
};

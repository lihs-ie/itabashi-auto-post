export class GASURLSearchParams {
  private params: Map<string, string[]>;

  constructor(
    init?:
      | string
      | Record<string, string | number | boolean>
      | [string, string | number | boolean][]
  ) {
    this.params = new Map<string, string[]>();

    if (typeof init === 'string') {
      this._parseQueryString(init);
    } else if (Array.isArray(init)) {
      init.forEach(([key, value]) => this.append(key, String(value)));
    } else if (init && typeof init === 'object') {
      Object.entries(init).forEach(([key, value]) =>
        this.append(key, String(value))
      );
    }
  }

  private _parseQueryString(query: string): void {
    query
      .replace(/^\?/, '')
      .split('&')
      .forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
          this.append(decodeURIComponent(key), decodeURIComponent(value || ''));
        }
      });
  }

  append(key: string, value: string): void {
    if (!this.params.has(key)) {
      this.params.set(key, []);
    }
    this.params.get(key)?.push(value);
  }

  set(key: string, value: string): void {
    this.params.set(key, [value]);
  }

  get(key: string): string | null {
    return this.params.get(key)?.[0] || null;
  }

  getAll(key: string): string[] {
    return this.params.get(key) || [];
  }

  has(key: string): boolean {
    return this.params.has(key);
  }

  delete(key: string): void {
    this.params.delete(key);
  }

  toString(): string {
    return Array.from(this.params.entries())
      .flatMap(([key, values]) =>
        values.map(
          value => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
      )
      .join('&')
      .replace(/%20/g, '+');
  }
}

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export const ContentType = {
  JSON: 'application/json',
  PLAIN: 'text/plain',
  HTML: 'text/html',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const Status = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type Status = (typeof Status)[keyof typeof Status];

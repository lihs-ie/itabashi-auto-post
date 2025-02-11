export abstract class Event implements GoogleAppsScript.Events.DoGet {
  public readonly parameter: { [key: string]: string };
  public readonly pathInfo: string;
  public readonly contextPath: string = '';
  public readonly contentLength: number = 0;
  public readonly queryString: string;
  public readonly parameters: { [key: string]: string[] };

  constructor(request: Request) {
    const url = new URL(request.url);
    this.queryString = url.searchParams.toString();
    this.pathInfo = url.pathname.split('/').slice(1).join('/');

    const paramMap: { [key: string]: string[] } = {};
    url.searchParams.forEach((value, key) => {
      if (!paramMap[key]) {
        paramMap[key] = [];
      }
      paramMap[key].push(value);
    });

    this.parameters = paramMap;
    this.parameter = Object.fromEntries(
      Object.entries(paramMap).map(([key, values]) => [key, values[0]])
    );
  }
}

export class GetEvent extends Event implements GoogleAppsScript.Events.DoGet {
  constructor(uri: string, options?: RequestInit) {
    if (options?.method && options.method !== 'GET') {
      throw new Error('Invalid method');
    }

    super(new Request(uri, options));
  }
}

export class PostEvent extends Event implements GoogleAppsScript.Events.DoPost {
  public readonly postData: GoogleAppsScript.Events.AppsScriptHttpRequestEventPostData;

  constructor(uri: string, options: RequestInit) {
    if (options.method !== 'POST') {
      throw new Error('Invalid method');
    }

    super(new Request(uri, options));

    this.postData = {
      length: 0,
      type: '',
      contents: options.body as string,
      name: '',
    };
  }
}

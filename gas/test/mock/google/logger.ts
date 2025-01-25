export class LoggerMock implements GoogleAppsScript.Base.Logger {
  private lastLog: string = '';

  clear(): void {
    this.lastLog = '';
  }

  getLog(): string {
    return this.lastLog;
  }

  log(data: unknown, ...rest: unknown[]): GoogleAppsScript.Base.Logger {
    this.lastLog = `${data}${rest.length ? rest.join('') : ''}`;
    return this;
  }
}

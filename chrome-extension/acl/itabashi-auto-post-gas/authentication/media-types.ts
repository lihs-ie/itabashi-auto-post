import { RawMedia as BaseRawMedia, Reader as BaseReader, Writer as BaseWriter, Payload } from "acl/common";
import { AuthenticationIdentifier, Code } from "domains/authentication";
import { injectable } from "inversify";

export type RawLoginMedia = BaseRawMedia<{ authentication: string }>;

export type LoginMedia = RawLoginMedia;

@injectable()
export class LoginReader implements BaseReader<LoginMedia> {
  public read(content: string): LoginMedia {
    return JSON.parse(content) as LoginMedia;
  }
}

export type RawLogoutMedia = Omit<BaseRawMedia, "payload">;

export type LogoutMedia = RawLogoutMedia;

@injectable()
export class LogoutReader implements BaseReader<LogoutMedia> {
  public read(content: string): LogoutMedia {
    return JSON.parse(content) as LogoutMedia;
  }
}

export type RawVerifyMedia = BaseRawMedia<{ active: boolean }>;

export type VerifyMedia = RawVerifyMedia;

@injectable()
export class VerifyReader implements BaseReader<VerifyMedia> {
  public read(content: string): VerifyMedia {
    return JSON.parse(content) as VerifyMedia;
  }
}

export type LoginBody = Payload<{code: {value: string, verifier: string}}>;

@injectable()
export class LoginWriter implements BaseWriter<Code> {
  constructor(private readonly password: string) {}

  public write(code: Code): string {
    return JSON.stringify({
      payload:{
        code: {
          value: code.identifier,
          verifier: code.verifier,
        },
        password: this.password,
      },
      action: "login",
    } as LoginBody);
  }
}

export type LogoutBody = Payload<{authentication: string}>;

@injectable()
export class LogoutWriter implements BaseWriter<AuthenticationIdentifier> {
  constructor(public readonly password: string) {}

  public write(authentication: AuthenticationIdentifier): string {
    return JSON.stringify({
      action: "logout",
      payload: {
        password: this.password,
        authentication: authentication.value,
      },
    } as LogoutBody);
  }
}

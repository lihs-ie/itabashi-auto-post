import { inject, Type, Upstream } from "../common";
import {
  VerifyResource,
  VerifyOverrides,
  LoginOverrides,
  LoginResource,
  LogoutOverrides,
  LogoutResource,
  MessageResource,
  MessageOverrides,
} from "./resources";

export class ItabashiAutoPostGas extends Upstream {
  public addLogin(type: Type, overrides?: LoginOverrides): LoginResource {
    const resource = new LoginResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addLogout(type: Type, overrides?: LogoutOverrides): LogoutResource {
    const resource = new LogoutResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addVerify(type: Type, overrides?: VerifyOverrides): VerifyResource {
    const resource = new VerifyResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addMessage(type: Type, overrides?: MessageOverrides): MessageResource {
    const resource = new MessageResource(type, overrides);
    this.add(resource);

    return resource;
  }
}

export const prepare = <T>(
  endpoint: string,
  registerer: (upstream: ItabashiAutoPostGas) => T
): T => {
  const upstream = new ItabashiAutoPostGas(endpoint);

  const resources = registerer(upstream);

  inject(upstream);

  return resources;
};

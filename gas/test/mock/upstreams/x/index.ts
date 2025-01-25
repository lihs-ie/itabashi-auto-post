import { Upstream, Type as CommonType, inject } from '../common';
import { Overrides as OauthOverrides, OauthResource } from './resources/oauth';
import { Overrides as TweetOverrides, TweetResource } from './resources/tweet';

export class X extends Upstream {
  public addOauth(type: CommonType, overrides?: OauthOverrides): OauthResource {
    const resource = new OauthResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addTweet(type: CommonType, overrides?: TweetOverrides): TweetResource {
    const resource = new TweetResource(type, overrides);
    this.add(resource);

    return resource;
  }
}

export const prepare = <R>(
  endpoint: string,
  registerer: (upstream: X) => R
): R => {
  const upstream = new X(endpoint);

  const resources = registerer(upstream);

  inject(upstream);

  return resources;
};

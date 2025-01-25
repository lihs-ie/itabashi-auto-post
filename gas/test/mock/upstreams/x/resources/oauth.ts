import {
  Authentication,
  AuthenticationIdentifier,
  authenticationSchema,
} from '@/domains/authentication';
import { Resource, Type as CommonType } from '../../common';
import { RawMedia } from '@/acl/x/oauth';
import { Builder } from 'test/factory/common';
import { AuthenticationFactory } from 'test/factory/domains/authentication/common';
import { OauthMedia } from '../media/oauth';
import { SyncRequestInit, SyncResponse } from '../../common/sync-fetch';

export type Overrides =
  | Authentication
  | { media: Partial<RawMedia>; identifier: AuthenticationIdentifier };

export class OauthResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'x/oauth';
  private readonly media: OauthMedia;
  private readonly identifier: AuthenticationIdentifier;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder(AuthenticationFactory).build());

    this.media = this.createMedia(overrides);
    this.identifier = this.overrides.identifier;
  }

  public code(): string {
    return `${OauthResource.CODE_PREFIX}/${this.identifier.value}`;
  }

  public matches(uri: string, options?: SyncRequestInit): boolean {
    if (options?.method !== 'post') {
      return false;
    }

    if (!uri.startsWith(`/oauth2/token`)) {
      return false;
    }

    return true;
  }

  public content(): string {
    return this.media.createSuccessfulContent();
  }

  protected createSuccessfulResponse(
    _uri: string,
    _options?: SyncRequestInit
  ): SyncResponse {
    return new SyncResponse(this.content(), { status: 200 });
  }

  private createMedia(overrides?: Overrides): OauthMedia {
    if (authenticationSchema.safeParse(overrides).success) {
      return new OauthMedia(overrides as Authentication);
    }

    return new OauthMedia((overrides as { media: Partial<RawMedia> })?.media);
  }
}

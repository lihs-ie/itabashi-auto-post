import { Message, messageSchema } from '@/domains/message';
import { URL } from '@/domains/common';
import { Resource, Type as CommonType } from '../../common';
import { TweetMedia } from '../media/tweet';
import { RawMedia } from '@/acl/x/tweet';
import { Builder } from 'test/factory/common';
import { MessageFactory } from 'test/factory/domains/message';
import { SyncRequestInit, SyncResponse } from '../../common/sync-fetch';

export type Overrides = Message | { media: RawMedia; identifier: URL };

export class TweetResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'gas/tweet';
  private readonly media: TweetMedia;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder(MessageFactory).build());
    this.media = this.createMedia(overrides);
  }

  public code(): string {
    return TweetResource.CODE_PREFIX;
  }

  public matches(uri: string, options?: SyncRequestInit): boolean {
    if (options?.method !== 'post') {
      return false;
    }

    if (!uri.startsWith('/tweets')) {
      return false;
    }

    const headers = options?.headers as { Authorization: string } | undefined;

    if (!headers) {
      return false;
    }

    if (!headers.Authorization.startsWith('Bearer ')) {
      return false;
    }

    const body = options?.body as string | undefined;

    if (!body) {
      return false;
    }

    if (!this.matchBody(body)) {
      return false;
    }

    return true;
  }

  public content(): string {
    return this.media.createSuccessfulContent();
  }

  protected createSuccessfulResponse(
    uri: string,
    options?: SyncRequestInit
  ): SyncResponse {
    return new SyncResponse(this.content(), { status: 200 });
  }

  private createMedia(overrides?: Overrides): TweetMedia {
    if (messageSchema.safeParse(overrides).success) {
      return new TweetMedia(overrides as Message);
    }

    return new TweetMedia(
      (overrides as { media: Partial<RawMedia> } | undefined)?.media
    );
  }

  private matchBody(body: string): boolean {
    if (messageSchema.safeParse(this.overrides).success) {
      const overrides = this.overrides as Message;

      const expected = JSON.stringify({
        text: `${overrides.content} / ニコ生配信中\n${this.overrides.identifier.value}`,
      });

      return body === expected.toString();
    } else {
      const overrides = this.overrides as { media: Partial<RawMedia> };

      return body === overrides.media.data?.text;
    }
  }
}

import { Message, messageSchema } from '@/domains/message';
import { Media } from '../../common';
import { RawMedia } from '@/acl/x/tweet';
import { Builder, StringFactory } from 'test/factory/common';

export class TweetMedia extends Media<Partial<RawMedia>, Message> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: 'unit',
          value: 'sku099',
        },
      ],
    });
  }

  protected fillByModel(overrides: Message): RawMedia {
    return {
      data: {
        id: overrides.identifier.value,
        text: overrides.content,
      },
    };
  }

  protected fill(overrides?: Partial<RawMedia> | Message): RawMedia {
    if (this.isModel(overrides)) {
      return this.fillByModel(overrides);
    }

    return {
      data: {
        id: Builder(StringFactory(1, 60)).build(),
        text: Builder(StringFactory(1, 255)).build(),
      },
      ...overrides,
    };
  }

  protected isModel(
    overrides?: Partial<RawMedia> | Message
  ): overrides is Message {
    return messageSchema.safeParse(overrides).success;
  }
}

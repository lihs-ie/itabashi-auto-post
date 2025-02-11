import { GASURLSearchParams } from '@/aspects/http';
import { Message } from '../../../domains/message';
import { Writer as BaseWriter } from '../../common';

export type RawMedia = {
  data: {
    id: string;
    text: string;
  };
};

export type Media = RawMedia;

export type Body = {
  text: string;
};

export const Writer = (): BaseWriter<Message> => {
  const write = (message: Message): string => {
    const payload: Body = {
      text: `${message.content} / ニコ生配信中\n${message.identifier.value}`,
    };

    return JSON.stringify(payload);
  };

  return { write };
};

import { Reader as BaseReader } from '../common';

export type RawMedia = {
  value: string;
};

export type Media = RawMedia;

export const Reader = (): BaseReader<Media> => {
  const read = (content: string): Media => {
    const payload = JSON.parse(content) as RawMedia;

    return payload;
  };

  return { read };
};

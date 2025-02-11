import { persistClient } from '@/aspects/script-properties';
import { Adaptor, Reader, Translator, Writer } from '../../../acl/x/oauth';
import { x } from '../../../config';

const writer = Writer(
  x.oauth.REDIRECT_URI,
  x.oauth.CLIENT_ID,
  x.oauth.CLIENT_SECRET
);

const adaptor = Adaptor(
  Reader(),
  writer,
  Translator(),
  persistClient(),
  x.oauth.CLIENT_ID,
  x.oauth.CLIENT_SECRET,
  x.API_ENDPOINT
);

export { adaptor };

import { persistClient } from '@/aspects/script-properties';
import { Adaptor, Reader, Translator } from '../../acl/credentials';
import { credentials } from '../../config';

const adaptor = Adaptor(
  Reader(),
  Translator(),
  credentials.PASSWORD_SALT,
  persistClient()
);

export { adaptor };

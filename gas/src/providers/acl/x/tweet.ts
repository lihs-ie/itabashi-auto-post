import { persistClient } from '@/aspects/script-properties';
import { Adaptor, Writer } from '../../../acl/x/tweet';
import { x } from '../../../config';

const adaptor = Adaptor(Writer(), x.API_ENDPOINT, persistClient());

export { adaptor };

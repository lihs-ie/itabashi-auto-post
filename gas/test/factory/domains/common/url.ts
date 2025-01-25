import { Factory } from '../../common';
import { URL } from '../../../../src/domains/common/url';

export const URLFactory = Factory<URL, { value: string }>({
  instantiate: value => URL(value),
  prepare: (overrides, seed) => ({
    value: `https://example.com/${seed % 10}`,
    ...overrides,
  }),
  retrieve: instance => ({
    value: instance.value,
  }),
});

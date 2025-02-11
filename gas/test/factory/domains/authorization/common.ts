import { Code, scopeType, scopeTypeSchema } from '@/domains/authorization';
import { Properties } from '@/domains/common';
import {
  Builder,
  EnumFactory,
  Factory,
  StringFactory,
} from 'test/factory/common';

export const ScopeTypeFactory = EnumFactory(scopeType, scopeTypeSchema);

export const CodeFactory = Factory<Code, Properties<Code>>({
  instantiate: value => Code(value),
  prepare: (overrides, seed) => ({
    value: Builder(StringFactory(1, 100)).buildWith(seed),
    verifier: Builder(StringFactory(43, 128)).buildWith(seed),
    ...overrides,
  }),
  retrieve: instance => ({
    value: instance.value,
    verifier: instance.verifier,
  }),
});

import { Type, typeSchema } from '@/domains/authentication';
import { EnumFactory } from 'test/factory/common';

export const TypeFactory = EnumFactory(Type, typeSchema);

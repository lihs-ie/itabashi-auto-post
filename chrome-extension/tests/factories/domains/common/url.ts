import { URL } from "domains/common/url";
import { Factory } from "tests/factories/common";

type Properties = {
  value: string;
  isRelative: boolean;
};

export class URLFactory extends Factory<URL, Properties> {
  protected instantiate(properties: Properties): URL {
    return new URL(properties.value, properties.isRelative);
  }

  protected prepare(overrides: Partial<Properties>, seed: number): Properties {
    const isRelative = overrides.isRelative ?? seed % 2 === 0;
    const origin = isRelative ? "" : "http://localhost";

    return {
      value: origin + `/some/${seed}`,
      isRelative,
      ...overrides,
    };
  }

  protected retrieve(instance: URL): Properties {
    return {
      value: instance.value,
      isRelative: instance.isRelative,
    };
  }
}

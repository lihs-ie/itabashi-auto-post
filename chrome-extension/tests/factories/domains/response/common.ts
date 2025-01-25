import { Response } from "domains/response";
import { Factory } from "tests/factories/common";

export type ResponseProperties<T> = {
  status: number;
  payload?: T;
};

export class ResponseFactory<T> extends Factory<Response<T>, ResponseProperties<T>> {
  protected instantiate(properties: ResponseProperties<T>): Response<T> {
    return new Response(properties.status, properties.payload);
  }

  protected prepare(
    overrides: Partial<ResponseProperties<T>>,
    seed: number
  ): ResponseProperties<T> {
    return {
      status: [200, 400, 404, 500][seed % 4],
      ...overrides,
    };
  }

  protected retrieve(instance: Response<T>): ResponseProperties<T> {
    return {
      status: instance.status,
    };
  }
}

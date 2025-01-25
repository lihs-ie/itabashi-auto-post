import { Status } from "aspects/http";
import { Resource } from "../../common";

export abstract class ItabashiAutoPostGasResource<
  T,
  O extends object,
  Q extends object
> extends Resource<T, O, Q> {
  protected createBadRequestResponse(_: Request): Response {
    return new Response(this.createFailedBody(Status.BAD_REQUEST), {
      status: Status.BAD_REQUEST,
    });
  }

  protected createNotFoundResponse(_: Request): Response {
    return new Response(this.createFailedBody(Status.NOT_FOUND), { status: Status.NOT_FOUND });
  }

  protected createInternalServerErrorResponse(_: Request): Response {
    return new Response(this.createFailedBody(Status.INTERNAL_SERVER_ERROR), {
      status: Status.INTERNAL_SERVER_ERROR,
    });
  }

  private createFailedBody(status: Status): string {
    return JSON.stringify({
      status,
      payload: {
        message: status,
      },
    });
  }
}

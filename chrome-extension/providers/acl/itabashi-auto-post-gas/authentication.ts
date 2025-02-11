import {
  Adaptor,
  LoginReader,
  LoginWriter,
  LogoutReader,
  LogoutWriter,
  Translator,
  VerifyReader,
} from "acl/itabashi-auto-post-gas/authentication";
import { PersistClient } from "acl/common";
import { itabashiAutoPostGAS } from "config";
import { Map } from "immutable";
import { ContainerModule } from "inversify";

export const gasAuthenticationACL = new ContainerModule((bind) => {
  bind(LoginReader).toSelf();
  bind(LogoutReader).toSelf();
  bind(VerifyReader).toSelf();

  bind(LoginWriter).toDynamicValue(() => new LoginWriter(itabashiAutoPostGAS.PASSWORD));
  bind(LogoutWriter).toDynamicValue(() => new LogoutWriter(itabashiAutoPostGAS.PASSWORD));

  bind(Translator).toSelf();

  bind(Adaptor).toDynamicValue(
    (context) =>
      new Adaptor(
        Map({
          login: context.container.get(LoginReader),
          logout: context.container.get(LogoutReader),
          verify: context.container.get(VerifyReader),
        }),
        Map({
          login: context.container.get(LoginWriter),
          logout: context.container.get(LogoutWriter),
        }),
        context.container.get(Translator),
        itabashiAutoPostGAS.API_ENDPOINT,
        new PersistClient()
      )
  );
});

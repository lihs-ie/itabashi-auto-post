import { Adaptor, Translator } from "acl/x/oauth";
import { x } from "config/x";
import { ContainerModule } from "inversify";

export const xOauthACL = new ContainerModule((bind) => {
  bind(Translator).toDynamicValue(() => new Translator(x.REDIRECT_URI));

  bind(Adaptor).toDynamicValue(
    (context) =>
      new Adaptor(
        context.container.get(Translator),
        x.AUTHORIZATION_ENDPOINT,
        x.REDIRECT_URI,
        x.CLIENT_ID
      )
  );
});

import { Translator } from "acl/itabashi-auto-post-gas/authentication";
import { Builder } from "tests/factories/common";
import { AuthenticationIdentifierFactory } from "tests/factories/domains/authentications";
import { LoginMedia } from "tests/mock/upstream/itabashi-auto-post-gas/media";

describe("Package translator", () => {
  describe("class translator", () => {
    describe("translate", () => {
      it("success returns authentication-identifier", () => {
        const expected = Builder.get(AuthenticationIdentifierFactory).build();
        const media = new LoginMedia(expected);

        const translator = new Translator();

        const actual = translator.translate(media.data());

        expect(expected.equals(actual)).toBeTruthy();
      });
    });
  });
});

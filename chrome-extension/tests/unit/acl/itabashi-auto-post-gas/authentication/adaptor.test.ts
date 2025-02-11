import { PersistClient } from "acl/common"
import {
  Adaptor,
  LoginReader,
  LoginWriter,
  LogoutReader,
  LogoutWriter,
  Translator,
  VerifyReader
} from "acl/itabashi-auto-post-gas/authentication"
import { Status } from "aspects/http"
import { Map } from "immutable"
import { Builder } from "tests/factories/common"
import {
  AuthenticationIdentifierFactory,
  CodeFactory
} from "tests/factories/domains/authentications"
import { LocalStorageMock } from "tests/mock/chrome/storage"
import { Type } from "tests/mock/upstream/common"
import { prepare } from "tests/mock/upstream/itabashi-auto-post-gas"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

const endpoint = "http://localhost:3000"
const password = "password"

const createAdaptor = () =>
  new Adaptor(
    Map({
      login: new LoginReader(),
      logout: new LogoutReader(),
      verify: new VerifyReader()
    }),
    Map({
      login: new LoginWriter(password),
      logout: new LogoutWriter(password)
    }),
    new Translator(),
    endpoint,
    new PersistClient()
  )

describe("Package adaptor", () => {
  describe("class adaptor", () => {
    beforeEach(() => {
      fetchMock.enableMocks()
    })

    afterEach(() => {
      fetchMock.resetMocks()
      fetchMock.disableMocks()
    })

    describe("login", () => {
      describe("successfully", () => {
        const storageMock = new LocalStorageMock()

        beforeEach(() => {
          global.chrome = {
            storage: {
              local: storageMock
            }
          }
        })

        it("returns authentication-identifier with after-login", async () => {
          const adaptor = createAdaptor()

          const expected = Builder.get(AuthenticationIdentifierFactory).build()
          const code = Builder.get(CodeFactory).build()

          prepare(endpoint, (upstream) =>
            upstream.addLogin(Type.OK, { model: expected, code, password })
          )

          const actual = await adaptor.login(code)

          expect(expected.equals(actual)).toBeTruthy()

          const persistedAuthentication =
            await storageMock.get("AUTHENTICATION")
          expect(
            persistedAuthentication.AUTHENTICATION === actual.value
          ).toBeTruthy()
        })
      })

      describe("unsuccessfully", () => {
        it.each(Object.values(Type).filter((type) => type !== "ok"))(
          "throws an error when returns %s",
          async (type) => {
            const adaptor = createAdaptor()

            const identifier = Builder.get(
              AuthenticationIdentifierFactory
            ).build()
            const code = Builder.get(CodeFactory).build()

            prepare(endpoint, (upstream) =>
              upstream.addLogin(type, { model: identifier, code, password })
            )

            await expect(adaptor.login(code)).rejects.toThrow()
          }
        )
      })
    })

    describe("logout", () => {
      describe("successfully", () => {
        const identifier = Builder.get(AuthenticationIdentifierFactory).build()
        const isLogin = Math.random() < 0.5

        const storageMock = new LocalStorageMock({
          AUTHENTICATION: identifier.value
        })

        beforeEach(() => {
          storageMock.store = {
            AUTHENTICATION: identifier.value
          }

          global.chrome.storage.local = storageMock
        })

        it("returns authentication-identifier with after-logout", async () => {
          const before = await storageMock.get("AUTHENTICATION")

          expect(before.AUTHENTICATION === identifier.value).toBeTruthy()

          const adaptor = createAdaptor()

          prepare(endpoint, (upstream) =>
            upstream.addLogout(Type.OK, { model: identifier, password })
          )

          await adaptor.logout()

          const after = await storageMock.get("AUTHENTICATION")
          expect(after.AUTHENTICATION).toBeUndefined()
        })
      })

      describe("unsuccessfully", () => {
        const identifier = Builder.get(AuthenticationIdentifierFactory).build()
        const isLogin = Math.random() < 0.5

        const storageMock = new LocalStorageMock({
          AUTHENTICATION: identifier.value,
          IS_LOGIN: isLogin
        })

        beforeEach(() => {
          storageMock.store = {
            AUTHENTICATION: identifier.value,
            IS_LOGIN: isLogin
          }

          global.chrome.storage.local = storageMock
        })

        it.each(Object.values(Type).filter((type) => type !== "ok"))(
          "throws an error when returns %s",
          async (type) => {
            const beforeAuthentication = await storageMock.get("AUTHENTICATION")
            const beforeIsLogin = await storageMock.get("IS_LOGIN")

            expect(
              beforeAuthentication.AUTHENTICATION === identifier.value
            ).toBeTruthy()
            expect(beforeIsLogin.IS_LOGIN === isLogin).toBeTruthy()

            const adaptor = createAdaptor()

            prepare(endpoint, (upstream) =>
              upstream.addLogout(type, { model: identifier, password })
            )

            await expect(adaptor.logout()).rejects.toThrow()

            const afterAuthentication = await storageMock.get("AUTHENTICATION")
            const afterIsLogin = await storageMock.get("IS_LOGIN")
            expect(
              beforeAuthentication.AUTHENTICATION ===
                afterAuthentication.AUTHENTICATION
            ).toBeTruthy()
            expect(
              beforeIsLogin.IS_LOGIN === afterIsLogin.IS_LOGIN
            ).toBeTruthy()
          }
        )
      })
    })

    describe("verify", () => {
      describe("successfully", () => {
        const identifier = Builder.get(AuthenticationIdentifierFactory).build()

        const storageMock = new LocalStorageMock({
          AUTHENTICATION: identifier.value
        })

        beforeEach(() => {
          storageMock.store = {
            AUTHENTICATION: identifier.value
          }

          global.chrome.storage.local = storageMock
        })

        it.each([true, false])(
          "persist isLogin with active true",
          async (active) => {
            const before = await storageMock.get("AUTHENTICATION")
            expect(before.AUTHENTICATION).toBe(identifier.value)

            const adaptor = createAdaptor()

            prepare(endpoint, (upstream) =>
              upstream.addVerify(Type.OK, { model: identifier, active })
            )

            await adaptor.verify()

            const after = await storageMock.get("AUTHENTICATION")
            active
              ? expect(after.AUTHENTICATION).toBe(identifier.value)
              : expect(after.AUTHENTICATION).toBeUndefined()
          }
        )
      })

      describe("unsuccessfully", () => {
        const identifier = Builder.get(AuthenticationIdentifierFactory).build()
        const isLogin = Math.random() < 0.5

        const storageMock = new LocalStorageMock({
          AUTHENTICATION: identifier.value
        })

        beforeEach(() => {
          storageMock.store = {
            AUTHENTICATION: identifier.value
          }

          global.chrome.storage.local = storageMock
        })

        it.each(Object.values(Type).filter((type) => type !== "ok"))(
          "throws an error when returns %s",
          async (type) => {
            const before = await storageMock.get("AUTHENTICATION")
            expect(before.AUTHENTICATION).toBe(identifier.value)

            const adaptor = createAdaptor()

            prepare(endpoint, (upstream) =>
              upstream.addVerify(type, { model: identifier, active: false })
            )

            await expect(adaptor.verify()).rejects.toThrow()

            const after = await storageMock.get("AUTHENTICATION")
            expect(after.AUTHENTICATION).toBeUndefined()
          }
        )

        it.each(Object.values(Status).filter((status) => status !== 200))(
          "throws an error when returns %s",
          async (status) => {
            const before = await storageMock.get("AUTHENTICATION")
            expect(before.AUTHENTICATION).toBe(identifier.value)

            const adaptor = createAdaptor()

            prepare(endpoint, (upstream) =>
              upstream.addVerify(Type.OK, {
                model: identifier,
                active: false,
                status
              })
            )

            try {
              await adaptor.verify()
            } catch (error) {
              expect(error.message).toBe(`Failed to verify: ${status}`)
            }
          }
        )
      })
    })
  })
})

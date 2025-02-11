import "reflect-metadata"
import "tests/expect"

import { afterEach, beforeEach, describe, it, vi } from "vitest"
import createFetchMock from "vitest-fetch-mock"

import { LocalStorageMock } from "./tests/mock/chrome/storage"

// fetch-mock
global.fetchMock = createFetchMock(vi)
global.describe = describe
global.beforeEach = beforeEach
global.afterEach = afterEach
global.it = it

// chrome.storage.local
;(global as any).chrome = {
  storage: {
    local: new LocalStorageMock()
  }
}

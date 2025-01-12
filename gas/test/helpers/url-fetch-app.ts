export type MockResponse = {
  getContentText: () => string;
  getResponseCode: () => number;
};

export const createFetchMock = (response: MockResponse) => {
  jest
    .spyOn(UrlFetchApp, 'fetch')
    .mockImplementation(
      () => response as GoogleAppsScript.URL_Fetch.HTTPResponse
    );
};

export type AbstractAdaptor<T> = {
  verifyStatus: (status: number) => boolean;
  handleErrorResponse: (
    response: GoogleAppsScript.URL_Fetch.HTTPResponse
  ) => void;
} & T;

export const AbstractAdaptor = <T>(delegate: T): AbstractAdaptor<T> => {
  const verifyStatus = (status: number): boolean => {
    if (status < 200) {
      return false;
    }

    if (299 < status) {
      return false;
    }

    return true;
  };

  const handleErrorResponse = (
    response: GoogleAppsScript.URL_Fetch.HTTPResponse
  ): void => {
    const status = response.getResponseCode();
    const text = response.getContentText();

    switch (status) {
      case 400:
        throw new Error(text);

      case 401:
        throw new Error(text);

      case 403:
        throw new Error(text);

      case 404:
        throw new Error(text);

      case 409:
        throw new Error(text);

      default:
        throw new Error(text);
    }
  };

  return {
    ...delegate,
    verifyStatus,
    handleErrorResponse,
  };
};

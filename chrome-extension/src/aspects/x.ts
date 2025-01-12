import { Scraper } from "./scraping";
import { NicoLiveSelector } from "config";
import { OAuth } from "config";
import { get, set } from "./storage";
import axios from "axios";
import { notify } from "./notifications";

type Error = {
  error: string;
};

const createState = () => {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
};

export const checkLogin = async (): Promise<boolean> => {
  try {
    const userId = await get<string | null>("userId");

    if (!userId) {
      return false;
    }

    const response = await axios<{ isLogin: boolean }>(`${OAuth.TOKEN_ENDPOINT}?userId=${userId}`);

    if (400 <= response.status) {
      throw new Error("Failed to check login.");
    }

    const data = response.data;

    await set("isLogin", data.isLogin);
    return data.isLogin;
  } catch (error) {
    console.error("Failed to check login:", error);
    return false;
  }
};

const extractCode = (initialState: string, redirectURI?: string): string => {
  if (!redirectURI) {
    throw new Error("Redirect URI not found.");
  }

  if (!redirectURI.startsWith(OAuth.REDIRECT_URI)) {
    throw new Error(`Invalid redirect URI: ${redirectURI}`);
  }

  const url = new URL(redirectURI);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || state !== initialState) {
    throw new Error("Authorization code not found or state mismatch.");
  }

  return code;
};

export const authenticate = async (): Promise<void> => {
  const initialState = createState();
  const authorizationURL = `${OAuth.AUTHORIZATION_ENDPOINT}?response_type=code&client_id=${
    OAuth.CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    OAuth.REDIRECT_URI
  )}&scope=tweet.write%20tweet.read%20users.read%20offline.access&state=${initialState}&code_challenge=challenge&code_challenge_method=plain`;

  try {
    const redirectUri = await chrome.identity.launchWebAuthFlow({
      url: authorizationURL,
      interactive: true,
    });

    const code = extractCode(initialState, redirectUri);

    await exchangeToken(code);
  } catch (error) {
    notify("authenticate", "basic", "Xのログインに失敗しました。", "再度ログインしてください。");
  }
};

export const exchangeToken = async (code: string): Promise<void> => {
  try {
    const response = await axios.post<{ userId: string }>(
      OAuth.TOKEN_ENDPOINT,
      {
        code,
        password: OAuth.GAS_PASSWORD,
        action: "issueToken",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (!data?.userId) {
      throw new Error("User ID not found in the response.");
    }

    await set("isLogin", true);
    await set("userId", data.userId);
  } catch (error) {
    throw new Error(`Failed to exchange token: ${error as Error}`);
  }
};

export const createTweet = (): string => {
  const title = Scraper.scrapeOgp(document, NicoLiveSelector.ogp.TITLE);
  const url = Scraper.scrapeOgp(document, NicoLiveSelector.ogp.URL);

  return `${title} / ${NicoLiveSelector.PROGRAM_DESCRIPTION}\n${url}`;
};

export const postTweet = async (tweet: string): Promise<void> => {
  const userId = await get<string>("userId");

  await fetch(OAuth.TWEET_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      password: OAuth.GAS_PASSWORD,
      tweet,
      action: "postTweet",
      userId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to tweet: " + response.statusText);
      }

      console.log("Tweeted successfully.");
    })
    .catch((error) => {
      console.error("Failed to tweet:", error);
    });
};

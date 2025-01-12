import { Message } from "aspects/runtime";

const scrape = (selector: string): Element | null => {
  const element = document.querySelector(selector);

  return element;
};

const createOgpSelector = (property: string): string => `meta[property="og:${property}"]`;

const scrapeOgp = (selector: string): string => {
  const element = scrape(selector);

  if (!element) {
    throw new Error("Element not found");
  }

  return element.getAttribute("content") || "";
};

const createTweet = (): string => {
  const title = scrapeOgp(createOgpSelector("title"));
  const url = scrapeOgp(createOgpSelector("url")) + "?ref=sharetw_ss_" + Date.now();

  return `${title} / ニコ生配信中\n${url}`;
};

const startButtonObserver = new MutationObserver(() => {
  const target = scrape('button[value="番組開始"]');

  if (target) {
    startButtonObserver.disconnect();
    target.addEventListener("click", () => {
      chrome.runtime.sendMessage<Message<string>>({
        action: "postTweet",
        payload: [createTweet()],
      });
    });
  }
});

if (!scrape('button[value="番組終了"]')) {
  startButtonObserver.observe(document, { childList: true, subtree: true });
}

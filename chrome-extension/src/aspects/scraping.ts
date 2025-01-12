import { NicoLiveSelector } from "config/nico-live";

export class Scraper {
  public static scrape(document: Document, selector: string): Element {
    const element = document.querySelector(selector);

    if (!element) {
      throw new Error("Element not found");
    }

    return element;
  }

  public static scrapeOgp(document: Document, selector: string): string {
    const element = this.scrape(document, selector);

    return element.getAttribute("content") || "";
  }
}

export const createOgpSelector = (property: string): string => `meta[property="og:${property}"]`;

export const startButtonObserver = (listener: (element: Element) => void): MutationObserver => {
  const observer = new MutationObserver(() => {
    const target = Scraper.scrape(document, NicoLiveSelector.START_BUTTON_SELECTOR);

    if (target) {
      observer.disconnect();
      listener(target);
    }
  });

  return observer;
};

const AD_SELECTOR = [
  "ins.adsbygoogle",
  ".adsbygoogle",
  ".google-auto-placed",
  "amp-ad",
  'iframe[id^="google_ads_iframe"]',
  'iframe[id^="aswift_"]',
  'iframe[name^="google_ads_iframe"]',
  'iframe[src*="doubleclick.net"]',
  'iframe[src*="googlesyndication"]',
  'iframe[src*="googleadservices"]',
  'iframe[src*="amazon-adsystem.com"]',
  'iframe[src*="adnxs.com"]',
  'iframe[src*="googletagservices.com"]',
  'div[id^="div-gpt-ad"]',
  'div[id^="google_ads_iframe"]',
  'div[id^="google_ads_"]',
  'div[id^="taboola-"]',
  'div[id^="outbrain_widget"]',
  ".OUTBRAIN",
  "[data-ad-slot]",
  "[data-ad-client]",
  "[data-ad-unit-path]",
  "[data-google-query-id]",
  '[aria-label="Advertisement" i]',
  'iframe[title="Advertisement" i]',
  'iframe[title="3rd party ad content" i]',
  'iframe[aria-label="Advertisement" i]',
  ".ad-banner",
  ".ad-unit",
  ".ad-container",
  ".ad-wrapper",
  ".ad-slot",
  ".ad-placeholder",
  ".advertisement",
  ".adsbox",
  ".popup-ad",
  "#ad-banner",
  "#ad-container",
  "#ad-top",
  "#ad-bottom",
  "#advertisement",
  "#popup-ad",
].join(",");

const SKIP_BUTTON_SELECTORS = [
  ".videoAdUiSkipButton",
  ".ima-skip-button",
  '[class*="skip-ad"]',
  'button[aria-label="Skip Ad"]',
  'button[aria-label="Skip ad"]',
  'button[aria-label="Skip ads"]',
];

const AD_VIDEO_ROOTS = ".ima-ad-container, [class*='ima-ad'], .video-ad, .ad-container";

function hideElement(element) {
  element.style.setProperty("display", "none", "important");
  element.style.setProperty("visibility", "hidden", "important");
  element.style.setProperty("height", "0", "important");
  element.style.setProperty("min-height", "0", "important");
  element.setAttribute("hidden", "true");
}

function hideAdElements(root) {
  if (!root?.querySelectorAll) return;

  if (root.nodeType === Node.ELEMENT_NODE && root.matches(AD_SELECTOR)) hideElement(root);
  for (const element of root.querySelectorAll(AD_SELECTOR)) hideElement(element);
}

function clickSkipButtons(root) {
  if (!root.querySelector) return;

  for (const selector of SKIP_BUTTON_SELECTORS) {
    const button = root.querySelector(selector);
    if (button && !button.disabled) button.click();
  }
}

function fastForwardAdVideo(root) {
  if (!root.querySelectorAll) return;

  for (const adRoot of root.querySelectorAll(AD_VIDEO_ROOTS)) {
    for (const video of adRoot.querySelectorAll("video")) {
      video.muted = true;
      video.playbackRate = 16;
      const duration = Number(video.duration);
      if (Number.isFinite(duration) && duration > 0) video.currentTime = duration;
    }
  }
}

function cleanupAds(root = document) {
  hideAdElements(root);
  clickSkipButtons(root);
  fastForwardAdVideo(root);
}

function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        cleanupAds(node);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function boot() {
  if (!document.documentElement) return;
  cleanupAds(document);
  setupObserver();
  setInterval(() => cleanupAds(document), 1000);
}

if (document.documentElement) boot();
else document.addEventListener("DOMContentLoaded", boot, { once: true });

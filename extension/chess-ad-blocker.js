const AD_ELEMENT_SELECTORS = [
  "#board-layout-ad",
  "#sidebar-ad",
  "#ad_unit",
  "#main-ad",
  "#tall-sidebar-ad",
  "#medium-rectangle-atf-ad",
  "#medium-rectangle-btf-ad",
  "#leaderboard-atf-ad",
  "#leaderboard-btf-ad",
  ".board-layout-ad",
  ".skyscraper-ad-component",
  ".skyscraper-ad-slot",
  ".short-sidebar-ad-component",
  ".short-sidebar-ad-top",
  ".short-sidebar-ad-bottom",
  ".game-over-ad-component",
  ".leaderboard-ad-component",
  ".leaderboard-ad-slot",
  ".leaderboard-atf-ad-wrapper",
  ".leaderboard-btf-ad-wrapper",
  ".medium-rectangle-ad-component",
  ".medium-rectangle-ad-slot",
  ".medium-rectangle-atf-ad-wrapper",
  ".medium-rectangle-btf-ad-wrapper",
  ".index-content-ad-wrapper",
  ".r2d2-wrapper",
  ".video-ad-component",
  '[class*="-ad-component"]',
  '[class*="-ad-wrapper"]',
  '[class*="-ad-slot"]',
  'iframe[id^="google_ads_iframe"]',
  'iframe[title="3rd party ad content"]',
  'iframe[aria-label="Advertisement"]',
  "ins.adsbygoogle",
  '[id^="div-gpt-ad"]',
];

const SKIP_BUTTON_SELECTORS = [
  ".videoAdUiSkipButton",
  ".ima-skip-button",
  '[class*="skip-ad"]',
  'button[aria-label="Skip Ad"]',
  'button[aria-label="Skip ad"]',
  'button[aria-label="Skip ads"]',
];

let lastUrl = location.href;

function hideAdElements(root = document) {
  if (!root.querySelectorAll) return;

  for (const selector of AD_ELEMENT_SELECTORS) {
    const elements = root.querySelectorAll(selector);
    for (const element of elements) {
      element.style.setProperty("display", "none", "important");
      element.style.setProperty("visibility", "hidden", "important");
      element.style.setProperty("height", "0", "important");
      element.style.setProperty("min-height", "0", "important");
      element.setAttribute("hidden", "true");
    }
  }
}

function clickSkipButtons(root = document) {
  if (!root.querySelector) return;

  for (const selector of SKIP_BUTTON_SELECTORS) {
    const button = root.querySelector(selector);
    if (button && !button.disabled) {
      button.click();
    }
  }
}

function fastForwardAdVideo(root = document) {
  if (!root.querySelectorAll) return;

  const adRoots = root.querySelectorAll(
    '.video-ad-component, [class*="-ad-component"], [class*="ima-"]',
  );
  for (const adRoot of adRoots) {
    const videos = adRoot.querySelectorAll("video");
    for (const video of videos) {
      video.muted = true;
      video.playbackRate = 16;
      const duration = Number(video.duration);
      if (Number.isFinite(duration) && duration > 0) {
        video.currentTime = duration;
      }
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

    if (location.href !== lastUrl) {
      lastUrl = location.href;
      cleanupAds(document);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

cleanupAds(document);
setupObserver();
setInterval(() => cleanupAds(document), 1000);

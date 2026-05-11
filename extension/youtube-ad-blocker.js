const AD_ELEMENT_SELECTORS = [
  'ytd-display-ad-renderer',
  'ytd-promoted-sparkles-web-renderer',
  'ytd-promoted-video-renderer',
  'ytd-video-masthead-ad-v3-renderer',
  'ytd-in-feed-ad-layout-renderer',
  'ytd-ad-slot-renderer',
  'ytm-promoted-video-renderer',
  '.ytp-ad-image-overlay',
  '.ytp-ad-overlay-container',
  '.ytp-suggested-action-badge',
  '.ytd-display-ad-renderer',
  '.ytd-promoted-sparkles-web-renderer',
];

const SKIP_BUTTON_SELECTORS = [
  '.ytp-ad-skip-button-modern',
  '.ytp-ad-skip-button',
  '.videoAdUiSkipButton',
  'button[aria-label="Skip ads"]',
  'button[aria-label="Skip ad"]',
];

let lastUrl = location.href;

function hideAdElements(root = document) {
  for (const selector of AD_ELEMENT_SELECTORS) {
    const elements = root.querySelectorAll(selector);
    for (const element of elements) {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.setAttribute('hidden', 'true');
    }
  }
}

function clickSkipButtons(root = document) {
  for (const selector of SKIP_BUTTON_SELECTORS) {
    const button = root.querySelector(selector);
    if (button && !button.disabled) {
      button.click();
    }
  }

  const closeOverlayButton = root.querySelector('.ytp-ad-overlay-close-button');
  if (closeOverlayButton) {
    closeOverlayButton.click();
  }
}

function fastForwardAdVideo(root = document) {
  if (!root.querySelector('.ad-showing')) return;

  const video = root.querySelector('video');
  if (!video) return;

  const duration = Number(video.duration);
  if (Number.isFinite(duration) && duration > 0) {
    video.currentTime = duration;
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
      if (mutation.type !== 'childList') continue;
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

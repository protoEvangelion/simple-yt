const APP_URL = "https://simple-yt.vercel.app";

chrome.runtime.onInstalled.addListener(() => {
  // Right-click on any YouTube link
  chrome.contextMenus.create({
    id: "open-in-simple-yt-link",
    title: "Open in Simple YT",
    contexts: ["link"],
    documentUrlPatterns: ["*://*.youtube.com/*"],
    targetUrlPatterns: ["*://*.youtube.com/watch?*"],
  });

  // Right-click anywhere on a YouTube video page
  chrome.contextMenus.create({
    id: "open-in-simple-yt-page",
    title: "Open in Simple YT",
    contexts: ["page"],
    documentUrlPatterns: ["*://*.youtube.com/watch?*"],
  });
});

function extractVideoId(url) {
  try {
    const { searchParams, pathname } = new URL(url);
    return searchParams.get("v") || (pathname.startsWith("/shorts/") ? pathname.split("/shorts/")[1] : null);
  } catch {
    return null;
  }
}

chrome.contextMenus.onClicked.addListener((info) => {
  const sourceUrl = info.linkUrl || info.pageUrl;
  const id = extractVideoId(sourceUrl);
  if (!id) return;
  chrome.tabs.create({ url: `${APP_URL}/player?id=${id}` });
});

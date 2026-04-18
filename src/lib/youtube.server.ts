import { YouTube, type Video } from "youtube-sr";
import { matchesTimeFilter, type TimeFilter } from "./time-filter";
import type { VideoResult } from "./youtube.types";

const MAX_RESULTS = 24;
const FILTERED_SEARCH_LIMIT = 48;
const YOUTUBE_BASE_URL = "https://www.youtube.com";
const SEARCH_RETRY_COUNT = 2;

type YoutubeSearchRenderer = {
  videoId?: string;
  title?: {
    runs?: Array<{ text?: string }>;
    simpleText?: string;
  };
  lengthText?: {
    simpleText?: string;
  };
  publishedTimeText?: {
    simpleText?: string;
  };
  viewCountText?: {
    simpleText?: string;
  };
  ownerText?: {
    runs?: Array<{ text?: string }>;
  };
  longBylineText?: {
    runs?: Array<{ text?: string }>;
  };
  thumbnail?: {
    thumbnails?: Array<{
      url?: string;
    }>;
  };
  badges?: Array<{
    metadataBadgeRenderer?: {
      label?: string;
      style?: string;
    };
  }>;
};

function getText(value?: { runs?: Array<{ text?: string }>; simpleText?: string }) {
  if (!value) {
    return "";
  }

  if (value.simpleText) {
    return value.simpleText;
  }

  return (
    value.runs
      ?.map((item) => item.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

function parseViewCount(text: string) {
  const normalizedText = text
    .toLowerCase()
    .replace(/views?/g, "")
    .replace(/,/g, "")
    .trim();
  const match = normalizedText.match(/([\d.]+)\s*([kmb])?/i);

  if (!match) {
    return 0;
  }

  const value = Number.parseFloat(match[1]);

  if (!Number.isFinite(value)) {
    return 0;
  }

  const multiplier = match[2]?.toLowerCase();

  if (multiplier === "k") {
    return Math.round(value * 1_000);
  }

  if (multiplier === "m") {
    return Math.round(value * 1_000_000);
  }

  if (multiplier === "b") {
    return Math.round(value * 1_000_000_000);
  }

  return Math.round(value);
}

function collectVideoRenderers(node: unknown, bucket: YoutubeSearchRenderer[] = []) {
  if (!node || typeof node !== "object") {
    return bucket;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectVideoRenderers(item, bucket);
    }

    return bucket;
  }

  const record = node as Record<string, unknown>;

  if (record.videoRenderer && typeof record.videoRenderer === "object") {
    bucket.push(record.videoRenderer as YoutubeSearchRenderer);
  }

  for (const value of Object.values(record)) {
    collectVideoRenderers(value, bucket);
  }

  return bucket;
}

function extractInitialData(html: string) {
  const patterns = [
    /var ytInitialData = (\{.*?\});<\/script>/s,
    /window\["ytInitialData"\] = (\{.*?\});/s,
    /ytInitialData\s*=\s*(\{.*?\});/s,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return JSON.parse(match[1]) as unknown;
    }
  }

  throw new Error("Unable to parse ytInitialData from YouTube search results page.");
}

function normalizeRenderer(renderer: YoutubeSearchRenderer): VideoResult | null {
  if (!renderer.videoId) {
    return null;
  }

  const title = getText(renderer.title);

  if (!title) {
    return null;
  }

  const channelName =
    getText(renderer.ownerText) || getText(renderer.longBylineText) || "Unknown channel";
  const thumbnails = renderer.thumbnail?.thumbnails ?? [];
  const thumbnail =
    thumbnails.at(-1)?.url || `https://i.ytimg.com/vi/${renderer.videoId}/hqdefault.jpg`;
  const badgeLabel = renderer.badges
    ?.map((badge) => badge.metadataBadgeRenderer?.label ?? badge.metadataBadgeRenderer?.style ?? "")
    .join(" ")
    .toLowerCase();
  const isLive = badgeLabel?.includes("live") ?? false;

  return {
    id: renderer.videoId,
    title,
    durationFormatted: isLive ? "Live" : renderer.lengthText?.simpleText || "Unknown",
    uploadedAt: renderer.publishedTimeText?.simpleText || "Recently uploaded",
    views: parseViewCount(renderer.viewCountText?.simpleText || "0"),
    thumbnail,
    channelName,
    url: `${YOUTUBE_BASE_URL}/watch?v=${renderer.videoId}`,
  };
}

async function fallbackYoutubeSearch(query: string, timeFilter: TimeFilter) {
  const response = await fetch(
    `${YOUTUBE_BASE_URL}/results?search_query=${encodeURIComponent(query)}&hl=en`,
    {
      headers: {
        "accept-language": "en-US,en;q=0.9",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`YouTube fallback search failed with status ${response.status}.`);
  }

  const html = await response.text();
  const initialData = extractInitialData(html);
  const renderers = collectVideoRenderers(initialData);

  return renderers
    .map((renderer) => normalizeRenderer(renderer))
    .filter((video): video is VideoResult => video !== null)
    .filter((video) => matchesTimeFilter(video.uploadedAt, timeFilter))
    .slice(0, MAX_RESULTS);
}

function normalizeVideo(video: Video): VideoResult | null {
  if (!video.id || !video.title) {
    return null;
  }

  const thumbnail =
    video.thumbnail?.displayThumbnailURL("maxresdefault") ??
    video.thumbnail?.url ??
    `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

  return {
    id: video.id,
    title: video.title,
    durationFormatted: video.live ? "Live" : video.durationFormatted || "Unknown",
    uploadedAt: video.uploadedAt || "Recently uploaded",
    views: Number.isFinite(video.views) ? video.views : 0,
    thumbnail,
    channelName: video.channel?.name || "Unknown channel",
    url: video.url,
  };
}

export async function searchYoutube(query: string, timeFilter: TimeFilter = "all") {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [] as VideoResult[];
  }

  for (let attempt = 0; attempt < SEARCH_RETRY_COUNT; attempt += 1) {
    try {
      const results = await YouTube.search(trimmedQuery, {
        limit: timeFilter === "all" ? MAX_RESULTS : FILTERED_SEARCH_LIMIT,
        type: "video",
        safeSearch: false,
      });

      return results
        .flatMap((video) => {
          const normalizedVideo = normalizeVideo(video);

          return normalizedVideo ? [normalizedVideo] : [];
        })
        .filter((video) => matchesTimeFilter(video.uploadedAt, timeFilter))
        .slice(0, MAX_RESULTS);
    } catch (error) {
      if (attempt === SEARCH_RETRY_COUNT - 1) {
        console.warn("youtube-sr search failed, using fallback parser", error);
      }
    }
  }

  return fallbackYoutubeSearch(trimmedQuery, timeFilter);
}

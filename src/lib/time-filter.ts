export const TIME_FILTERS = ["all", "week", "month", "quarter", "year"] as const;

export type TimeFilter = (typeof TIME_FILTERS)[number];

export const TIME_FILTER_LABELS: Record<TimeFilter, string> = {
  all: "All time",
  week: "Last week",
  month: "Last month",
  quarter: "Last quarter",
  year: "Last year",
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const TIME_FILTER_LIMITS: Record<Exclude<TimeFilter, "all">, number> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
};

export function isTimeFilter(value: unknown): value is TimeFilter {
  return typeof value === "string" && TIME_FILTERS.includes(value as TimeFilter);
}

export function getAgeInDays(uploadedAt: string) {
  const normalized = uploadedAt.trim().toLowerCase();

  if (!normalized) {
    return Number.POSITIVE_INFINITY;
  }

  if (normalized.includes("today") || normalized.includes("just now") || normalized.includes("hour")) {
    return 0;
  }

  if (normalized.includes("yesterday")) {
    return 1;
  }

  const match = normalized.match(/(\d+)\s+(day|week|month|year)s?/);

  if (!match) {
    return Number.POSITIVE_INFINITY;
  }

  const value = Number.parseInt(match[1], 10);

  if (!Number.isFinite(value)) {
    return Number.POSITIVE_INFINITY;
  }

  switch (match[2]) {
    case "day":
      return value;
    case "week":
      return value * 7;
    case "month":
      return value * 30;
    case "year":
      return value * 365;
    default:
      return Number.POSITIVE_INFINITY;
  }
}

export function matchesTimeFilter(uploadedAt: string, filter: TimeFilter) {
  if (filter === "all") {
    return true;
  }

  return getAgeInDays(uploadedAt) <= TIME_FILTER_LIMITS[filter];
}

export function getCutoffLabel(filter: TimeFilter) {
  if (filter === "all") {
    return "Any upload time";
  }

  const cutoffDays = TIME_FILTER_LIMITS[filter];
  const cutoffDate = new Date(Date.now() - cutoffDays * DAY_IN_MS);

  return cutoffDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
import { Button, Card, CardBody, Skeleton } from "@heroui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Blocks, ShieldOff, Tv2 } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { PlayerOverlay } from "../components/player-overlay";
import { SearchHero } from "../components/search-hero";
import {
  getCutoffLabel,
  isTimeFilter,
  matchesTimeFilter,
  TIME_FILTER_LABELS,
  type TimeFilter,
} from "../lib/time-filter";
import { VideoCard } from "../components/video-card";
import { searchVideos } from "../lib/youtube.functions";
import type { VideoResult } from "../lib/youtube.types";

type HomeSearch = {
  q?: string;
  time?: TimeFilter;
  video?: string;
};

const PITCH_CARDS = [
  {
    icon: ShieldOff,
    title: "No rabbit holes",
    description:
      "No algorithm. No autoplay. No recommendations designed to keep you glued. Search a thing, watch a thing, close the tab.",
  },
  {
    icon: Blocks,
    title: "No account required",
    description:
      "Zero sign-in friction. No Google login, no watch history, no personalized feed quietly learning your weaknesses.",
  },
  {
    icon: Tv2,
    title: "Mini player built in",
    description:
      "Pop the video into a floating window and keep browsing. Watch a talk while you read the thing that inspired you to search for it.",
  },
] as const;

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    q: typeof search.q === "string" && search.q.trim() ? search.q.trim().slice(0, 120) : undefined,
    time: isTimeFilter(search.time) ? search.time : undefined,
    video: typeof search.video === "string" && search.video ? search.video : undefined,
  }),
  loaderDeps: ({ search }) => ({ q: search.q, time: search.time }),
  loader: async ({ deps }) => {
    if (!deps.q) return { errorMessage: "", results: [] as VideoResult[] };

    try {
      return {
        errorMessage: "",
        results: await searchVideos({ data: { query: deps.q, time: deps.time } }),
      };
    } catch (error) {
      console.error(error);
      return {
        errorMessage: "Search failed. YouTube is probably changing its markup again.",
        results: [] as VideoResult[],
      };
    }
  },
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate({ from: "/" });
  const search = Route.useSearch();
  const { errorMessage, results } = Route.useLoaderData();
  const selectedTimeFilter = search.time ?? "all";
  const timeParam = selectedTimeFilter === "all" ? undefined : selectedTimeFilter;

  const [query, setQuery] = useState(search.q ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredResults = results.filter((video) =>
    matchesTimeFilter(video.uploadedAt, selectedTimeFilter),
  );
  const activeVideo = filteredResults.find((video) => video.id === search.video) ?? null;
  const hasSearched = Boolean(search.q);

  useEffect(() => {
    setQuery(search.q ?? "");
    setIsLoading(false);
    setVisibleCount(6);
  }, [search.q, results.length, errorMessage]);

  const updateSearch = (nextSearch: HomeSearch) => {
    startTransition(() => void navigate({ to: "/", search: () => nextSearch }));
  };

  const submitSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) { setIsLoading(false); updateSearch({}); return; }
    if (trimmedQuery === search.q) { setIsLoading(false); return; }
    setIsLoading(true);
    updateSearch({ q: trimmedQuery, time: timeParam });
  };

  const openVideo = (videoId: string) => {
    if (!search.q) return;
    updateSearch({ q: search.q, time: timeParam, video: videoId });
  };

  const closeVideo = () => {
    updateSearch(search.q ? { q: search.q, time: timeParam } : {});
  };

  return (
    <main className="mx-auto min-h-screen w-[min(1220px,calc(100%-1.5rem))] pb-16 sm:w-[min(1220px,calc(100%-2.5rem))]">
      <SearchHero
        hasSearched={hasSearched}
        isLoading={isLoading}
        query={query}
        selectedTimeFilter={selectedTimeFilter}
        onQueryChange={setQuery}
        onSubmit={submitSearch}
        onTimeFilterChange={(value) => updateSearch({ q: search.q, time: value === "all" ? undefined : value })}
      />

      <AnimatePresence initial={false}>
        {!hasSearched ? <PitchCards /> : null}
      </AnimatePresence>

      {errorMessage ? <ErrorBanner message={errorMessage} /> : null}

      {isLoading ? <SkeletonGrid /> : null}

      {!isLoading && hasSearched && filteredResults.length > 0 ? (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredResults.slice(0, visibleCount).map((video) => (
              <VideoCard key={video.id} video={video} onPress={() => openVideo(video.id)} />
            ))}
          </section>
          {visibleCount < filteredResults.length ? (
            <div className="mt-8 flex justify-center">
              <Button
                className="border border-black/10 bg-white/70 text-[var(--app-foreground)] backdrop-blur-md data-[hover=true]:bg-white dark:border-white/10 dark:bg-white/8 dark:data-[hover=true]:bg-white/14"
                radius="full"
                variant="flat"
                onPress={() => setVisibleCount((c) => c + 6)}
              >
                Load more
              </Button>
            </div>
          ) : null}
        </>
      ) : null}

      {!isLoading && hasSearched && !filteredResults.length && !errorMessage ? (
        <EmptyState results={results} selectedTimeFilter={selectedTimeFilter} />
      ) : null}

      <PlayerOverlay video={activeVideo} onClose={closeVideo} />
    </main>
  );
}

function PitchCards() {
  return (
    <motion.section
      key="home-features"
      animate={{ opacity: 1, y: 0, height: "auto" }}
      className="mt-8 grid gap-4 overflow-hidden lg:grid-cols-[1.4fr_1fr_1fr]"
      exit={{ opacity: 0, y: -20, height: 0, marginTop: 0 }}
      initial={{ opacity: 0, y: 20, height: "auto" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {PITCH_CARDS.map(({ icon: Icon, title, description }, index) => (
        <motion.div
          key={title}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: index * 0.04, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card
            className="editorial-panel h-full border border-black/10 bg-white/70 shadow-[0_24px_80px_rgba(16,21,33,0.08)] dark:border-white/8 dark:bg-white/6"
            radius="lg"
            shadow="none"
          >
            <CardBody className="gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--app-foreground)] dark:bg-white/10">
                <Icon size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--app-foreground)]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">{description}</p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </motion.section>
  );
}

function SkeletonGrid() {
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="rounded-[1.75rem]">
          <div className="h-[22rem] w-full rounded-[1.75rem] bg-black/8 dark:bg-white/8" />
        </Skeleton>
      ))}
    </section>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <Card
      className="mt-8 border border-rose-400/30 bg-rose-50/90 text-rose-900 dark:bg-rose-500/10 dark:text-rose-100"
      radius="lg"
      shadow="none"
    >
      <CardBody>
        <p className="text-sm font-medium">{message}</p>
      </CardBody>
    </Card>
  );
}

function EmptyState({ results, selectedTimeFilter }: { results: VideoResult[]; selectedTimeFilter: TimeFilter }) {
  return (
    <Card
      className="mt-8 border border-black/10 bg-white/78 dark:border-white/8 dark:bg-white/6"
      radius="lg"
      shadow="none"
    >
      <CardBody className="p-8 text-center">
        <p className="eyebrow">No results</p>
        <h2 className="display-font mt-3 text-4xl font-semibold tracking-[-0.03em] text-[var(--app-foreground)]">
          {results.length > 0 ? "Nothing matched that time window." : "The search came back empty."}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--app-muted)]">
          {results.length > 0
            ? `Try widening the filter from ${TIME_FILTER_LABELS[selectedTimeFilter].toLowerCase()} or adjust the query. Current cutoff: ${getCutoffLabel(selectedTimeFilter)}.`
            : "Try a broader query or a specific channel, artist, director, talk title, or live session. YouTube search is imperfect because of course it is."}
        </p>
      </CardBody>
    </Card>
  );
}

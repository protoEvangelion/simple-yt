import { Button, Input } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { TIME_FILTER_LABELS, type TimeFilter } from "../lib/time-filter";
import { ThemeToggle } from "./theme-toggle";

type SearchHeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasSearched: boolean;
  selectedTimeFilter: TimeFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
};

export function SearchHero({
  query,
  onQueryChange,
  onSubmit,
  isLoading,
  hasSearched,
  selectedTimeFilter,
  onTimeFilterChange,
}: SearchHeroProps) {
  return (
    <section className={`relative ${hasSearched ? "pt-8 sm:pt-10" : "pt-12 sm:pt-24"}`}>
      <div className="mb-8 flex items-start justify-between gap-4">
        <AnimatePresence initial={false}>
          {!hasSearched ? (
            <motion.div
              key="search-hero-heading"
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -18, height: 0, marginBottom: 0 }}
              initial={{ opacity: 0, y: 12, height: "auto" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow mb-3">Simple YT</p>
              <h1 className="display-font max-w-4xl text-5xl leading-[0.92] font-semibold tracking-[-0.04em] text-[var(--app-foreground)] sm:text-7xl lg:text-8xl">
                Search fast. Click play. Stay out of the sludge.
              </h1>
            </motion.div>
          ) : (
            <motion.p
              key="search-hero-compact-label"
              animate={{ opacity: 1, y: 0 }}
              className="eyebrow mt-2"
              initial={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              Simple YT
            </motion.p>
          )}
        </AnimatePresence>
        <ThemeToggle />
      </div>

      <div className="editorial-panel relative overflow-hidden rounded-[2rem] p-4 shadow-[0_30px_120px_rgba(8,10,22,0.22)] sm:p-6">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-full bg-[radial-gradient(circle,rgba(255,181,140,0.22),transparent_62%)] blur-3xl" />

        <AnimatePresence initial={false}>
          {!hasSearched ? (
            <motion.p
              key="search-hero-description"
              animate={{ opacity: 1, y: 0, height: "auto" }}
              className="mb-5 max-w-2xl text-sm leading-6 text-[var(--app-muted)] sm:text-base"
              exit={{ opacity: 0, y: -12, height: 0, marginBottom: 0 }}
              initial={{ opacity: 0, y: 10, height: "auto" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              No accounts, no feed, no thumbnail landfill. Type a query, get a clean set of
              video results, and open a focused player.
            </motion.p>
          ) : null}
        </AnimatePresence>

        <form
          className={hasSearched ? "mt-1" : ""}
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Input
            autoFocus
            classNames={{
              base: "w-full",
              input: "text-base sm:text-lg",
              inputWrapper:
                "min-h-16 rounded-[1.6rem] border border-black/10 bg-white/75 px-4 shadow-[0_20px_70px_rgba(17,21,36,0.08)] backdrop-blur-xl group-data-[focus=true]:border-[var(--accent-strong)] dark:border-white/10 dark:bg-white/6",
            }}
            endContent={
              <Button
                className="bg-[var(--accent-strong)] px-5 font-semibold text-black data-[hover=true]:bg-[var(--accent-warm)]"
                data-testid="search-submit"
                isLoading={isLoading}
                radius="full"
                type="submit"
              >
                Search
              </Button>
            }
            placeholder="Search for music, talks, film essays, chaos, whatever"
            radius="full"
            size="lg"
            startContent={<Search className="text-[var(--app-muted)]" size={18} />}
            data-testid="search-input"
            value={query}
            variant="flat"
            onValueChange={onQueryChange}
          />
        </form>

        {hasSearched ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(TIME_FILTER_LABELS).map(([value, label]) => {
              const isActive = selectedTimeFilter === value;

              return (
                <Button
                  key={value}
                  className={
                    isActive
                      ? "bg-[var(--accent-strong)] font-semibold text-black data-[hover=true]:bg-[var(--accent-warm)]"
                      : "border border-black/10 bg-white/70 text-[var(--app-foreground)] backdrop-blur-md data-[hover=true]:bg-white dark:border-white/10 dark:bg-white/8 dark:data-[hover=true]:bg-white/14"
                  }
                  radius="full"
                  size="sm"
                  variant="flat"
                  onPress={() => onTimeFilterChange(value as TimeFilter)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

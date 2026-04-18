import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/player")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : "",
  }),
  component: PlayerPage,
});

function PlayerPage() {
  const { id } = Route.useSearch();

  if (!id) return null;

  return (
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: 0, background: "#000" }}
      title="Mini player"
    />
  );
}

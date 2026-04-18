import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";
import { ExternalLink, PictureInPicture2 } from "lucide-react";
import type { VideoResult } from "../lib/youtube.types";

type PlayerOverlayProps = {
  video: VideoResult | null;
  onClose: () => void;
};

export function PlayerOverlay({ video, onClose }: PlayerOverlayProps) {
  const openMiniPlayer = () => {
    if (!video) return;
    const w = 640, h = 370;
    const left = Math.round(screen.width - w - 20);
    const top = Math.round(screen.height - h - 80);
    window.open(
      `/player?id=${video.id}`,
      "mini-player",
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=no`,
    );
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/80",
        base: "border-y border-white/10 bg-[var(--player-surface)] text-[var(--app-foreground)] shadow-[0_40px_140px_rgba(0,0,0,0.55)] max-w-full w-full rounded-none",
        body: "p-0",
        wrapper: "p-0 items-center",
      }}
      hideCloseButton
      isOpen={Boolean(video)}
      placement="center"
      scrollBehavior="inside"
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <ModalContent>
        {video ? (
          <ModalBody>
            <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-black">
              <iframe
                data-testid="player-overlay"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
                referrerPolicy="strict-origin-when-cross-origin"
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
              />
            </div>

            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div>
                <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-[var(--app-muted)] uppercase">
                  {video.channelName}
                </p>
                <h2 className="display-font text-3xl leading-tight font-semibold tracking-[-0.03em] sm:text-4xl">
                  {video.title}
                </h2>
                <p className="mt-3 text-sm text-[var(--app-muted)]">
                  {video.uploadedAt} · {new Intl.NumberFormat("en").format(video.views)} views
                </p>
              </div>

              <div className="flex gap-3 lg:flex-col">
                <Button
                  as="a"
                  className="bg-[var(--accent-strong)] font-semibold text-black data-[hover=true]:bg-[var(--accent-warm)]"
                  endContent={<ExternalLink size={16} />}
                  href={video.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Watch on YT
                </Button>
                <Button
                  className="border border-black/10 bg-black/5 text-[var(--app-foreground)] dark:border-white/10 dark:bg-white/8"
                  endContent={<PictureInPicture2 size={16} />}
                  variant="flat"
                  onPress={openMiniPlayer}
                >
                  Mini player
                </Button>
                <Button
                  className="border border-black/10 bg-black/5 text-[var(--app-foreground)] dark:border-white/10 dark:bg-white/8"
                  variant="flat"
                  onPress={onClose}
                >
                  Back to results
                </Button>
              </div>
            </div>
          </ModalBody>
        ) : null}
      </ModalContent>
    </Modal>
  );
}

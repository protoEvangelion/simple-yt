import { Card, CardBody, Image } from "@heroui/react";
import { motion } from "framer-motion";
import type { VideoResult } from "../lib/youtube.types";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type VideoCardProps = {
  video: VideoResult;
  onPress: () => void;
};

export function VideoCard({ video, onPress }: VideoCardProps) {
  return (
    <motion.div
      data-testid="video-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card
        isPressable
        className="group overflow-hidden border border-black/10 bg-white/72 text-left text-inherit shadow-[0_18px_60px_rgba(12,16,30,0.08)] backdrop-blur-md dark:border-white/8 dark:bg-white/6"
        radius="lg"
        shadow="none"
        onPress={onPress}
      >
        <CardBody className="gap-4 p-0">
          <div className="relative aspect-video overflow-hidden">
            <Image
              alt={video.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              classNames={{ wrapper: "h-full w-full !max-w-none rounded-none" }}
              radius="none"
              removeWrapper
              src={video.thumbnail}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 via-black/10 to-transparent" />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
              <span className="rounded-full border border-white/18 bg-black/72 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-white uppercase backdrop-blur-md">
                {video.durationFormatted}
              </span>
              <span className="rounded-full border border-white/18 bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                {compactNumber.format(video.views)} views · {video.uploadedAt}
              </span>
            </div>
          </div>

          <div className="p-4 pt-0">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[var(--app-muted)] uppercase">
              {video.channelName}
            </p>
            <h2 className="line-clamp-2 text-lg leading-tight font-semibold text-[var(--app-foreground)]">
              {video.title}
            </h2>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

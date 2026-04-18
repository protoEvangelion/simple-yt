import { createServerFn } from "@tanstack/react-start";
import { isTimeFilter, type TimeFilter } from "./time-filter";

type SearchInput = {
  query: string;
  time?: TimeFilter;
};

export const searchVideos = createServerFn({ method: "GET" })
  .inputValidator((data: SearchInput) => {
    const query = data.query.trim().slice(0, 120);

    if (!query) {
      throw new Error("Search query is required.");
    }

    return {
      query,
      time: isTimeFilter(data.time) ? data.time : "all",
    };
  })
  .handler(async ({ data }) => {
    const { searchYoutube } = await import("./youtube.server");

    return searchYoutube(data.query, data.time);
  });

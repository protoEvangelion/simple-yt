'use server'
const YouTube = require('youtube-sr').default

export type YtVideo = {
  id: string
  durationFormatted: string
  uploadedAt: string
  views: number
  channel: {
    name: string
  }
}

export async function search(search: string) {
  const values = (await YouTube.search(search, { limit: 10 })) as YtVideo[]

  return values.map((x) => ({
    id: x.id,
    durationFormatted: x.durationFormatted,
    uploadedAt: x.uploadedAt,
    views: x.views,
    channel: {
      name: x.channel.name,
    },
  }))
}

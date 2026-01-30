'use server'
const YouTube = require('youtube-sr').default

// RESPONSE {
//     "nsfw": false,
//     "shorts": false,
//     "unlisted": false,
//     "id": "twkFJPZItJ4",
//     "title": "Vivek: This is the #1 thing we must reject",
//     "description": null,
//     "durationFormatted": "5:24",
//     "duration": 324000,
//     "uploadedAt": "1 month ago",
//     "views": 109440,
//     "thumbnail": {
//         "id": "twkFJPZItJ4",
//         "width": 720,
//         "height": 404,
//         "url": "https://i.ytimg.com/vi/twkFJPZItJ4/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD856rxaQHZVn3F6_ieOBfB2BQAYA"
//     },
//     "channel": {
//         "name": "Fox News"
//     },
//     "likes": 0,
//     "dislikes": 0,
//     "live": false,
//     "private": false,
//     "tags": []
// }

export type YtVideo = {
  id: string
  durationFormatted: string
  uploadedAt: string
  views: number
  title: string
  channel: {
    name: string
  }
}

export async function search(search: string) {
  const values = (await YouTube.search(search, { limit: 5 })) as YtVideo[]

  return values.map((x) => ({
    id: x.id,
    title: x.title,
    durationFormatted: x.durationFormatted,
    uploadedAt: x.uploadedAt,
    views: x.views,
    channel: {
      name: x.channel.name,
    },
  }))
}

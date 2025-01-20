'use server'
const YouTube = require('youtube-sr').default

export async function search(search: string) {
  const values = (await YouTube.search(search, { limit: 10 })) as {
    id: string
  }[]
  return values.map((x) => x.id)
}

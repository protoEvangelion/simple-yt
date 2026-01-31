'use client'

import React from 'react'
import { YtVideo, search } from '../actions'
import { Card, CardBody, CardFooter, Input, Skeleton, Select, SelectItem } from '@heroui/react'

const ytSearch = async (text: string) => search(text)

type RecencyFilter = 'all' | 'hour' | 'today' | 'week' | 'month' | 'year'

export const YtSearch = () => {
  const [text, setText] = React.useState('')
  const [loading, setIsLoading] = React.useState(false)
  const [videoList, setVideoList] = React.useState<YtVideo[]>([])
  const [recencyFilter, setRecencyFilter] = React.useState<RecencyFilter>('all')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    // Auto-focus the input on mount
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const onSearch = async () => {
    setIsLoading(true)
    setVideoList(await ytSearch(text))
    setIsLoading(false)
  }

  const filterVideosByRecency = (videos: YtVideo[]): YtVideo[] => {
    if (recencyFilter === 'all') return videos

    return videos.filter((video) => {
      const uploadedText = video.uploadedAt.toLowerCase()
      
      // Note: This is a best-effort filter based on text parsing of the uploadedAt field.
      // The youtube-sr API doesn't provide precise timestamps, only human-readable strings.
      // This may not be 100% accurate for edge cases.
      
      if (recencyFilter === 'hour') {
        return uploadedText.includes('minute') || uploadedText.includes('hour')
      } else if (recencyFilter === 'today') {
        return uploadedText.includes('minute') || uploadedText.includes('hour')
      } else if (recencyFilter === 'week') {
        return uploadedText.includes('minute') || uploadedText.includes('hour') || 
               uploadedText.includes('day') || uploadedText.includes('week')
      } else if (recencyFilter === 'month') {
        return uploadedText.includes('minute') || uploadedText.includes('hour') || 
               uploadedText.includes('day') || uploadedText.includes('week') || 
               uploadedText.includes('month')
      } else if (recencyFilter === 'year') {
        return uploadedText.includes('minute') || uploadedText.includes('hour') || 
               uploadedText.includes('day') || uploadedText.includes('week') || 
               uploadedText.includes('month') || uploadedText.includes('year')
      }
      return true
    })
  }

  const filteredVideos = filterVideosByRecency(videoList)

  return (
    <div className="m-8 flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Input
          ref={inputRef}
          label="Search"
          className="w-[80vw]"
          onChange={(x) => setText(x.target.value)}
          onKeyUp={(x) => {
            if (x.key === 'Enter') {
              onSearch()
            }
          }}
          endContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
              onClick={onSearch}
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          }
        />
      </div>
      
      <div className="flex gap-4 items-center">
        <Select
          label="Filter by recency"
          placeholder="All time"
          selectedKeys={[recencyFilter]}
          className="max-w-xs"
          onChange={(e) => setRecencyFilter(e.target.value as RecencyFilter)}
        >
          <SelectItem key="all">All time</SelectItem>
          <SelectItem key="hour">Last hour</SelectItem>
          <SelectItem key="today">Today</SelectItem>
          <SelectItem key="week">This week</SelectItem>
          <SelectItem key="month">This month</SelectItem>
          <SelectItem key="year">This year</SelectItem>
        </Select>
      </div>

      {loading ? (
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
      ) : (
        <div className="gap-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
          {filteredVideos.map((x) => (
            <Card key={x.id} classNames={{ base: 'flex justify-center' }}>
              <CardBody className="max-w-3xl">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${x.id}?rel=0`}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </CardBody>
              <CardFooter className="pb-0 pt-2 px-4 flex-col items-start">
                <p>{x.title}</p>
                <p>
                  {x.durationFormatted} | {x.uploadedAt} |{' '}
                  {x.views.toLocaleString()}
                </p>
                <p>{x.channel?.name}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import React from 'react'
import { YtVideo, search } from '../actions'
import { Card, CardBody, CardFooter, Input, Skeleton } from '@heroui/react'

const ytSearch = async (text: string) => {
  const data = await search(text)
  return data
}

export const YtSearch = () => {
  const [text, setText] = React.useState('')
  const [loading, setIsLoading] = React.useState(false)
  const [videoList, setVideoList] = React.useState<YtVideo[]>([])

  const onSearch = async () => {
    setIsLoading(true)
    setVideoList(await ytSearch(text))
    setIsLoading(false)
  }

  return (
    <div className="m-8 flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Input
          label="Search"
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

      {loading ? (
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
      ) : (
        <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {videoList.map((x) => (
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
                <p>{x.channel?.name}</p>
                <p>Duration: {x.durationFormatted}</p>
                <p>Uploaded At: {x.uploadedAt}</p>
                <p>Views: {x.views.toLocaleString()}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

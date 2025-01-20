'use client'

import React from 'react'
import { search } from '../actions'
import { Button, Card, CardBody, Input, Skeleton } from '@heroui/react'

export const YtSearch = () => {
  const [text, setText] = React.useState('')
  const [loading, setIsLoading] = React.useState(false)
  const [videoList, setVideoList] = React.useState<string[]>([])

  return (
    <div className=" m-4 flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Input
          label="Search"
          onChange={(x) => setText(x.target.value)}
          onKeyUp={async (x) => {
            if (x.key === 'Enter') {
              setIsLoading(true)
              setVideoList(await search(text))
              setIsLoading(false)
            }
          }}
        />

        <Button
          isLoading={loading}
          onPress={async () => {
            setIsLoading(true)
            setVideoList(await search(text))
            setIsLoading(false)
          }}
          color="primary"
        >
          Button
        </Button>
      </div>

      {loading ? (
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
      ) : (
        videoList.map((x) => (
          <Card key={x} classNames={{ base: 'flex justify-center' }}>
            <CardBody className="max-w-3xl">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${x}?rel=0`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string | null
  recordings: Array<{
    id: string
    file_url: string
    file_name: string
  }>
  isPlaying: boolean
}

export function VideoPlayer({ videoUrl, recordings, isPlaying }: VideoPlayerProps) {
  const displayUrl = videoUrl || recordings[0]?.file_url

  return (
    <Card className="h-full flex items-center justify-center bg-black/5">
      {displayUrl ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative aspect-video max-h-full bg-black rounded-lg overflow-hidden">
            {/* Placeholder for video player - would use actual video element in production */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center size-16 rounded-full bg-primary/20 mb-4 mx-auto">
                  <Play className="size-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Video Player</p>
                <p className="text-xs text-muted-foreground mt-1">Click timeline to play</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4 mx-auto">
            <Play className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No video uploaded</h3>
          <p className="text-sm text-muted-foreground">Upload a video to start editing</p>
        </div>
      )}
    </Card>
  )
}

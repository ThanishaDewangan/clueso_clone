"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface TimelineProps {
  projectId: string
  isPlaying: boolean
  onPlayPause: () => void
}

export function Timeline({ projectId, isPlaying, onPlayPause }: TimelineProps) {
  return (
    <div className="h-full flex flex-col p-4">
      {/* Playback Controls */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="icon">
          <SkipBack className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onPlayPause}>
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        <Button variant="outline" size="icon">
          <SkipForward className="size-4" />
        </Button>

        <div className="flex-1 px-4">
          <Slider defaultValue={[0]} max={100} step={1} />
        </div>

        <div className="text-sm font-mono text-muted-foreground">0:00 / 0:00</div>
      </div>

      {/* Timeline Tracks */}
      <div className="flex-1 bg-background rounded-lg border overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Video Track */}
          <div className="h-12 border-b px-3 flex items-center gap-2 bg-muted/50">
            <div className="w-20 text-xs font-medium">Video</div>
            <div className="flex-1 h-8 bg-primary/20 rounded"></div>
          </div>

          {/* Audio Track */}
          <div className="h-12 border-b px-3 flex items-center gap-2 bg-muted/50">
            <div className="w-20 text-xs font-medium">Audio</div>
            <div className="flex-1 h-8 bg-blue-500/20 rounded"></div>
          </div>

          {/* Captions Track */}
          <div className="h-12 px-3 flex items-center gap-2 bg-muted/50">
            <div className="w-20 text-xs font-medium">Captions</div>
            <div className="flex-1 h-6 bg-green-500/20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

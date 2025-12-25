"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Video, ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { VideoPlayer } from "./video-player"
import { Timeline } from "./timeline"
import { AIPanel } from "./ai-panel"
import type { User } from "@supabase/supabase-js"

interface EditorLayoutProps {
  project: {
    id: string
    title: string
    description: string | null
    video_url: string | null
    status: string
  }
  user: User
  recordings: Array<{
    id: string
    file_url: string
    file_name: string
  }>
  scripts: Array<{
    id: string
    content: string
    version: number
  }>
}

export function EditorLayout({ project, user, recordings, scripts }: EditorLayoutProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary">
                <Video className="size-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-sm">{project.title}</h1>
                <p className="text-xs text-muted-foreground">{project.status}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 size-4" />
              Share
            </Button>
            <Button size="sm">
              <Download className="mr-2 size-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Video Player & Timeline */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 p-6">
            <VideoPlayer videoUrl={project.video_url} recordings={recordings} isPlaying={isPlaying} />
          </div>

          <Separator />

          {/* Timeline */}
          <div className="h-48 border-t bg-muted/30">
            <Timeline projectId={project.id} isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} />
          </div>
        </div>

        <Separator orientation="vertical" />

        {/* Right Panel - AI Tools */}
        <div className="w-96 overflow-y-auto p-4 bg-muted/30">
          <AIPanel projectId={project.id} />
        </div>
      </div>
    </div>
  )
}

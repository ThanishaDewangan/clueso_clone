"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Play, Trash2, Edit, Download } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Project {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  status: string
  duration: number | null
  created_at: string
  updated_at: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    processing: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-destructive/10 text-destructive",
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "—"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{project.title}</h3>
            <p className="text-sm text-muted-foreground">
              Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/editor/${project.id}`}>
                  <Edit className="mr-2 size-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {project.status === "completed" && (
                <DropdownMenuItem>
                  <Download className="mr-2 size-4" />
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <Link href={`/editor/${project.id}`}>
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3 group-hover:ring-2 group-hover:ring-primary transition-all">
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url || "/placeholder.svg"}
                alt={project.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Play className="size-12 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Play className="size-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>

        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
        )}

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={statusColors[project.status] || statusColors.draft}>
            {project.status}
          </Badge>
          {project.duration && (
            <span className="text-sm text-muted-foreground">{formatDuration(project.duration)}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href={`/editor/${project.id}`}>
            <Play className="mr-2 size-4" />
            Open Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

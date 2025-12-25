"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Video, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { VideoUpload } from "./video-upload"

interface NewProjectFormProps {
  userId: string
}

export function NewProjectForm({ userId }: NewProjectFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: userId,
          title: title || "Untitled Project",
          description: description || null,
          status: "draft",
        })
        .select()
        .single()

      if (error) throw error

      setProjectId(data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadComplete = (videoUrl: string) => {
    if (projectId) {
      router.push(`/editor/${projectId}`)
    }
  }

  if (projectId) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Created Successfully</CardTitle>
            <CardDescription>Now upload your screen recording to get started</CardDescription>
          </CardHeader>
        </Card>

        <VideoUpload projectId={projectId} userId={userId} onUploadComplete={handleUploadComplete} />

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.push(`/editor/${projectId}`)}>
            Skip Upload & Go to Editor
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Give your project a name and description</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="My Awesome Product Video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your video project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 size-4" />
                    Create Project
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

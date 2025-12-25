"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileVideo, Loader2 } from "lucide-react"

interface VideoUploadProps {
  projectId: string
  userId: string
  onUploadComplete?: (videoUrl: string) => void
}

export function VideoUpload({ projectId, userId, onUploadComplete }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    // Validate file type
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"]
    if (!validTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload MP4, MOV, or WebM files.")
      return
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024 // 500MB in bytes
    if (selectedFile.size > maxSize) {
      setError("File too large. Maximum size is 500MB.")
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const uploadFile = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("projectId", projectId)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await response.json()
      setProgress(100)

      // Extract video metadata
      const video = document.createElement("video")
      video.src = URL.createObjectURL(file)
      video.onloadedmetadata = async () => {
        await fetch("/api/video/extract-metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recording_id: data.recordingId,
            duration: Math.floor(video.duration),
            width: video.videoWidth,
            height: video.videoHeight,
            fps: 30, // Default, would need more complex extraction for actual FPS
          }),
        })
        URL.revokeObjectURL(video.src)
      }

      if (onUploadComplete) {
        onUploadComplete(data.url)
      }

      // Reset after short delay
      setTimeout(() => {
        setFile(null)
        setProgress(0)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {!file ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                <Upload className="size-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Upload Screen Recording</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your video file here, or click to browse
              </p>
              <Button type="button" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 size-4" />
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-4">Supported formats: MP4, MOV, WebM (Max 500MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <FileVideo className="size-8 text-primary shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split("/")[1].toUpperCase()}
                </p>
              </div>
              {!uploading && (
                <Button variant="ghost" size="icon" onClick={removeFile} className="shrink-0">
                  <X className="size-4" />
                </Button>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

            {!uploading ? (
              <Button onClick={uploadFile} className="w-full">
                <Upload className="mr-2 size-4" />
                Upload Video
              </Button>
            ) : (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Uploading...
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

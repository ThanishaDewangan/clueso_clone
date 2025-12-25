import { put } from "@vercel/blob"
import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only MP4, MOV, and WebM are allowed." }, { status: 400 })
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 500MB." }, { status: 400 })
    }

    // Upload to Vercel Blob with user-specific path
    const filename = `${user.id}/${Date.now()}-${file.name}`
    const blob = await put(filename, file, {
      access: "public",
    })

    // Store recording in database
    const { data: recording, error: dbError } = await supabase
      .from("recordings")
      .insert({
        project_id: projectId,
        file_url: blob.url,
        file_name: file.name,
        file_size: file.size,
        duration: 0, // Will be updated after processing
        status: "uploaded",
      })
      .select()
      .single()

    if (dbError) {
      // Clean up blob if database insert fails
      await fetch(`/api/delete`, {
        method: "DELETE",
        body: JSON.stringify({ url: blob.url }),
      })
      return NextResponse.json({ error: "Failed to save recording" }, { status: 500 })
    }

    // Update project status to processing
    await supabase.from("projects").update({ status: "processing" }).eq("id", projectId)

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
      recordingId: recording.id,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

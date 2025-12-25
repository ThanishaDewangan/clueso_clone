import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { recording_id, duration, width, height, fps } = body

  try {
    // Update recording with metadata
    const { error } = await supabase
      .from("recordings")
      .update({
        duration,
        metadata: {
          width,
          height,
          fps,
          extracted_at: new Date().toISOString(),
        },
      })
      .eq("id", recording_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Metadata extraction error:", error)
    return NextResponse.json({ error: "Failed to extract metadata" }, { status: 500 })
  }
}

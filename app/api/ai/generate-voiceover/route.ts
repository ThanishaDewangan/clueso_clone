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
  const { script_id, voice, language = "en" } = body

  // Get the script
  const { data: script } = await supabase
    .from("scripts")
    .select("*, projects!inner(user_id)")
    .eq("id", script_id)
    .single()

  if (!script || script.projects.user_id !== user.id) {
    return NextResponse.json({ error: "Script not found" }, { status: 404 })
  }

  try {
    // In production, this would use a text-to-speech API like ElevenLabs or OpenAI TTS
    // For now, we'll return a placeholder response
    const audioUrl = `/audio/voiceover-${script_id}-${Date.now()}.mp3`

    // Update project with voiceover info
    await supabase
      .from("projects")
      .update({
        voiceover_url: audioUrl,
        voiceover_voice: voice,
        voiceover_language: language,
        updated_at: new Date().toISOString(),
      })
      .eq("id", script.project_id)

    return NextResponse.json({
      success: true,
      audioUrl,
      voice,
      language,
      message: "Voiceover generation started. In production, this would use real TTS API.",
    })
  } catch (error) {
    console.error("Voiceover generation error:", error)
    return NextResponse.json({ error: "Failed to generate voiceover" }, { status: 500 })
  }
}

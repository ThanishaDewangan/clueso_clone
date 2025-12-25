import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateText } from "ai"

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
  const { project_id, prompt, improve_existing } = body

  // Verify project ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id, title, description")
    .eq("id", project_id)
    .eq("user_id", user.id)
    .single()

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a professional video script writer. Create a clear, engaging script for a product demo video.

Project Title: ${project.title}
Description: ${project.description || "No description provided"}
${prompt ? `Additional Instructions: ${prompt}` : ""}

Create a script that:
- Has a compelling introduction
- Clearly explains key features and benefits
- Uses conversational, engaging language
- Includes smooth transitions between sections
- Ends with a strong call-to-action
- Is formatted with clear sections using markdown

Generate the complete script now:`,
    })

    const { data: script, error } = await supabase
      .from("scripts")
      .insert({
        project_id,
        content: text,
        version: 1,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ script })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json({ error: "Failed to generate script" }, { status: 500 })
  }
}

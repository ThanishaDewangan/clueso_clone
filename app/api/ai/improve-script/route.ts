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
  const { script_id, improvements } = body

  // Get the existing script
  const { data: existingScript } = await supabase
    .from("scripts")
    .select("*, projects!inner(user_id)")
    .eq("id", script_id)
    .single()

  if (!existingScript || existingScript.projects.user_id !== user.id) {
    return NextResponse.json({ error: "Script not found" }, { status: 404 })
  }

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a professional video script editor. Improve the following script to make it more engaging, clear, and professional.

Current Script:
${existingScript.content}

${improvements ? `Specific improvements requested: ${improvements}` : ""}

Enhance the script by:
- Making the language more engaging and conversational
- Improving clarity and flow
- Adding impactful transitions
- Strengthening the call-to-action
- Maintaining the same overall structure and length
- Keeping markdown formatting

Provide the improved script:`,
    })

    const { data: script, error } = await supabase
      .from("scripts")
      .update({
        content: text,
        version: existingScript.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", script_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ script })
  } catch (error) {
    console.error("AI improvement error:", error)
    return NextResponse.json({ error: "Failed to improve script" }, { status: 500 })
  }
}

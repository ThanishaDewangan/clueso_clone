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
  const { script_id, target_language } = body

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
    const languageNames: Record<string, string> = {
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
      ar: "Arabic",
      hi: "Hindi",
    }

    const targetLangName = languageNames[target_language] || target_language

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Translate the following video script to ${targetLangName}. Maintain the tone, style, and formatting.

Original Script:
${script.content}

Translated Script in ${targetLangName}:`,
    })

    // Create a new script version with translation
    const { data: translatedScript, error } = await supabase
      .from("scripts")
      .insert({
        project_id: script.project_id,
        content: text,
        version: script.version + 1,
        language: target_language,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      script: translatedScript,
      language: target_language,
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Failed to translate script" }, { status: 500 })
  }
}

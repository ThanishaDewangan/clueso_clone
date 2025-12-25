import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createServerClient()
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("project_id")

  if (!projectId) {
    return NextResponse.json({ error: "Project ID required" }, { status: 400 })
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: comments, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles(id, full_name, avatar_url)
    `,
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comments })
}

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
  const { project_id, content, timestamp } = body

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      project_id,
      user_id: user.id,
      content,
      timestamp,
    })
    .select(
      `
      *,
      profiles(id, full_name, avatar_url)
    `,
    )
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comment })
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditorLayout } from "@/components/editor/editor-layout"

interface EditorPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch project details
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single()

  if (projectError || !project) {
    redirect("/dashboard")
  }

  // Fetch recordings for this project
  const { data: recordings } = await supabase
    .from("recordings")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  // Fetch scripts for this project
  const { data: scripts } = await supabase
    .from("scripts")
    .select("*")
    .eq("project_id", projectId)
    .order("version", { ascending: false })

  return <EditorLayout project={project} user={user} recordings={recordings || []} scripts={scripts || []} />
}

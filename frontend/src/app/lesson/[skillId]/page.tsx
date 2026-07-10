import { LessonClient } from "./LessonClient"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function LessonPage({ params }: { params: Promise<{ skillId: string }> }) {
  const { skillId } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value || "0";

  let lesson = null;
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/lessons/${skillId}?user_id=${userId}`, { cache: 'no-store' })
    if (res.ok) {
      lesson = await res.json()
    }
  } catch (error) {
    console.error("Failed to fetch lesson:", error)
  }

  if (!lesson) {
    redirect("/learn")
  }

  return (
    <LessonClient lesson={lesson} userId={parseInt(userId)} />
  )
}

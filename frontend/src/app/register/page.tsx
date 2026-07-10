"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

function RegisterForm() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const finishedIntro = searchParams.get("finished_intro") === "true"

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, password: password, finished_intro: finishedIntro })
      })

      if (res.ok) {
        const data = await res.json()
        // Save user_id in cookies for 30 days
        document.cookie = `userId=${data.user_id}; path=/; max-age=${60 * 60 * 24 * 30}`
        
        // After registration, send them to take the test
        router.push("/learn")
      } else {
        console.error("Failed to register")
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#18252a] max-w-md w-full rounded-2xl p-8 shadow-sm border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-slate-700 dark:text-slate-100 mb-2">Create Profile</h1>
      <p className="text-slate-500 dark:text-slate-400 font-semibold mb-8 text-center">
        {finishedIntro 
          ? "You've completed the learning session! Enter your name to save your progress and unlock the test." 
          : "Create an account to save your progress."}
      </p>

      <form onSubmit={handleRegister} className="w-full flex flex-col gap-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-14 bg-white dark:bg-[#131f24] text-slate-700 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 text-lg font-bold outline-none focus:border-[#58cc02] dark:focus:border-[#58cc02]"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 bg-white dark:bg-[#131f24] text-slate-700 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 text-lg font-bold outline-none focus:border-[#58cc02] dark:focus:border-[#58cc02]"
            disabled={loading}
          />
          <Button 
            type="submit" 
            size="lg" 
            variant="primary" 
            className="w-full"
            disabled={!name.trim() || !password.trim() || loading}
          >
            {loading ? "SAVING..." : "CREATE PROFILE"}
          </Button>
        </form>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-100 dark:bg-[#131f24] p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}

"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !password.trim()) return

    setLoading(true)
    setError("")
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, password: password })
      })

      if (res.ok) {
        const data = await res.json()
        // Save user_id in cookies for 30 days
        document.cookie = `userId=${data.user_id}; path=/; max-age=${60 * 60 * 24 * 30}`
        
        // After login, send them to the learn page
        router.push("/learn")
      } else {
        setError("Invalid username or password.")
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-100 dark:bg-[#131f24] p-6">
      <div className="bg-white dark:bg-[#18252a] max-w-md w-full rounded-2xl p-8 shadow-sm border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-slate-700 dark:text-slate-100 mb-2">Log in</h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold mb-8 text-center">
          Enter your name and password to sign into your existing profile.
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-y-4">
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
          {error && <p className="text-rose-500 font-bold text-sm text-center">{error}</p>}
          <Button 
            type="submit" 
            size="lg" 
            variant="primary" 
            className="w-full"
            disabled={!name.trim() || !password.trim() || loading}
          >
            {loading ? "LOGGING IN..." : "LOG IN"}
          </Button>
          
          <div className="flex justify-center mt-4">
            <Link href="/register" className="text-slate-400 dark:text-slate-500 font-bold text-sm hover:text-slate-500 dark:hover:text-slate-400">
              DON'T HAVE AN ACCOUNT?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

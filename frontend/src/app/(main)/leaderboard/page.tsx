"use client"
import { useEffect, useState } from "react"
import { Shield } from "lucide-react"

type LeaderboardUser = {
  id: number;
  username: string;
  total_xp: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [currentUserId, setCurrentUserId] = useState<number>(0)

  useEffect(() => {
    // get user ID from cookie
    const cookies = document.cookie.split(';')
    const uidCookie = cookies.find(c => c.trim().startsWith('userId='))
    if (uidCookie) {
      setCurrentUserId(parseInt(uidCookie.split('=')[1]))
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/leaderboard`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-10 border-b-2 border-slate-200 dark:border-slate-700 pb-8">
        <Shield className="w-20 h-20 text-yellow-400 mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-700 dark:text-slate-100">Emerald League</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-2">Top 10 learners this week</p>
      </div>

      <div className="flex flex-col gap-y-2">
        {users.map((u, index) => (
          <div 
            key={u.id} 
            className={`flex items-center p-5 rounded-2xl font-bold transition-transform hover:-translate-y-1 active:translate-y-0 ${currentUserId === u.id ? 'bg-[#ddf4ff] border-2 border-[#1cb0f6] dark:bg-[#18252a] dark:border-blue-500' : 'bg-white border-2 border-slate-200 hover:bg-slate-50 dark:bg-[#131f24] dark:border-slate-700 dark:hover:bg-slate-800'}`}
          >
            <div className={`w-8 text-center text-xl ${index < 3 ? 'text-yellow-500 font-black' : 'text-slate-400 dark:text-slate-500'}`}>
              {index + 1}
            </div>
            
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold ml-4 mr-6">
              {u.username.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 text-slate-700 dark:text-slate-200 text-lg">
              {u.username}
            </div>
            
            <div className="text-slate-500 dark:text-slate-400">
              {u.total_xp} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

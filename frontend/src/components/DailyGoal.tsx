"use client"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import Link from "next/link"

export const DailyGoal = () => {
  const [xp, setXp] = useState(0)
  
  useEffect(() => {
    const userId = Cookies.get("userId") || "0"
    if (userId !== "0") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/progress/user/${userId}`)
        .then(res => res.json())
        .then(user => {
          if (user) {
            setXp(user.total_xp || 0)
          }
        })
        .catch(console.error)
    }
  }, [])

  const goal = 50
  const progress = Math.min((xp / goal) * 100, 100)

  return (
    <div className="bg-white dark:bg-[#131f24] rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 w-full mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-extrabold text-slate-700 dark:text-slate-100 text-lg">Daily Quests</h3>
        <Link href="/profile" className="font-bold text-blue-500 hover:text-blue-400 transition-colors">View All</Link>
      </div>
      
      <div className="flex gap-x-4 items-center">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
        <div className="flex-1 flex flex-col gap-y-2">
          <h4 className="font-bold text-slate-700 dark:text-slate-100">Earn {goal} XP</h4>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden relative">
            <div 
              className="bg-blue-500 h-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white z-10 drop-shadow-sm">
              {Math.min(xp, goal)} / {goal}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

type Props = {
  className?: string
}

export const TopBar = ({ className }: Props) => {
  const [streak, setStreak] = useState(0)
  const [hearts, setHearts] = useState(0)
  const [xp, setXp] = useState(0)
  const [gems, setGems] = useState(0)
  
  useEffect(() => {
    // Load gems
    const savedGems = localStorage.getItem("mock_gems")
    if (savedGems) {
      setGems(parseInt(savedGems))
    }

    const userId = Cookies.get("userId") || "0"
    if (userId !== "0") {
      fetch(`http://127.0.0.1:8000/api/progress/user/${userId}`)
        .then(res => res.json())
        .then(user => {
          if (user) {
            setStreak(user.streak || 0)
            setHearts(user.hearts || 0)
            setXp(user.total_xp || 0)
          }
        })
        .catch(error => console.error("Failed to fetch user in TopBar:", error))
    }
  }, [])

  return (
    <nav className={cn("h-[50px] flex items-center px-4 border-b-2 dark:border-slate-800 fixed top-0 w-full z-50 bg-white dark:bg-[#131f24]", className)}>
      <div className="max-w-[1056px] mx-auto flex items-center justify-between w-full">
        <div className="font-extrabold text-[#58cc02] tracking-wide text-xl">
          duolingo
        </div>
        
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          <div className="text-blue-500 font-bold flex items-center gap-x-1">
             ⚡ {xp}
          </div>
          <div className="text-orange-500 font-bold flex items-center gap-x-1">
             🔥 {streak}
          </div>
          <div className="flex items-center gap-x-1 text-[#1cb0f6] font-bold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l8 8-8 12-8-12 8-8z"/></svg>
            {gems}
          </div>
          <div className="text-red-500 font-bold flex items-center gap-x-1">
             ❤️ {hearts}
          </div>
        </div>
      </div>
    </nav>
  )
}

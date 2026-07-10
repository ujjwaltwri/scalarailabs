"use client"
import { useState, useEffect } from "react"
import { Gem } from "lucide-react"
import Cookies from "js-cookie"

export default function ShopPage() {
  const [gems, setGems] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [userId, setUserId] = useState(0)

  // Load mocked gems and real user hearts
  useEffect(() => {
    const saved = localStorage.getItem("mock_gems")
    if (saved) {
      setGems(parseInt(saved))
    } else {
      setGems(1000)
      localStorage.setItem("mock_gems", "1000")
    }

    const uid = Cookies.get("userId")
    if (uid && uid !== "0") {
      setUserId(parseInt(uid))
      fetch(`http://127.0.0.1:8000/api/progress/user/${uid}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.hearts !== undefined) {
            setHearts(data.hearts)
          }
        })
        .catch(console.error)
    }
  }, [])

  const addGems = (amount: number) => {
    const newGems = gems + amount
    setGems(newGems)
    localStorage.setItem("mock_gems", newGems.toString())
  }

  const spendGems = (amount: number) => {
    if (gems >= amount) {
      const newGems = gems - amount
      setGems(newGems)
      localStorage.setItem("mock_gems", newGems.toString())
      return true
    }
    return false
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 relative">
      
      {/* Gem Counter Header */}
      <div className="absolute top-8 right-8 flex items-center gap-x-2 bg-white dark:bg-[#131f24] px-4 py-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
        <Gem className="w-6 h-6 text-[#1cb0f6]" />
        <span className="text-xl font-bold text-[#1cb0f6]">{gems}</span>
      </div>

      <div className="flex flex-col items-center justify-center mb-10 border-b-2 border-slate-200 dark:border-slate-700 pb-8">
        <Gem className="w-20 h-20 text-[#1cb0f6] mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-700 dark:text-slate-100">Shop</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mt-2">Spend your gems here!</p>
      </div>

      <div className="flex flex-col gap-y-4">
        
        {/* Free Gems Mock */}
        <div 
          onClick={() => addGems(500)}
          className="flex items-center justify-between p-6 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer active:bg-slate-100 dark:active:bg-slate-700 transition"
        >
          <div className="flex items-center gap-x-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Gem className="w-10 h-10 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-700 dark:text-slate-100">Free Gems!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold">Click and see the magic</p>
            </div>
          </div>
          <button className="bg-blue-500 text-white hover:bg-blue-400 font-bold py-2 px-6 rounded-xl border-b-4 border-blue-600 active:border-b-0 active:translate-y-1">
            FREE
          </button>
        </div>


        <div 
          onClick={async () => {
            if (hearts >= 5) {
              alert("Your hearts are already full!")
              return
            }
            if (spendGems(500)) {
              if (userId !== 0) {
                try {
                  await fetch("http://127.0.0.1:8000/api/progress/refill-hearts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId })
                  })
                } catch (e) {
                  console.error(e)
                }
              }
              setHearts(5)
              alert("Hearts refilled successfully! (Gems deducted)")
              // Refresh the page to update the TopBar if needed
              window.location.reload()
            } else {
              alert("Not enough gems!")
            }
          }}
          className="flex items-center justify-between p-6 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer active:bg-slate-100 dark:active:bg-slate-700 transition"
        >
          <div className="flex items-center gap-x-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-700 dark:text-slate-100">Refill Hearts</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold">Get 5 full hearts for 500 gems.</p>
            </div>
          </div>
          <button className={gems >= 500 ? "bg-white dark:bg-[#18252a] text-[#1cb0f6] border-2 border-slate-200 dark:border-slate-700 font-bold py-2 px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800" : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-300 font-bold py-2 px-6 rounded-xl border-b-4 border-slate-300 dark:border-slate-600"}>
            500 💎
          </button>
        </div>
      </div>
    </div>
  )
}

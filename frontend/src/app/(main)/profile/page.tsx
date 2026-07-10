"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Zap, Flame, Loader2, Settings, Trophy, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/SettingsProvider"
import { DailyGoal } from "@/components/DailyGoal"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("0")
  const [gems, setGems] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  
  // Settings context
  const { soundEnabled, speakingEnabled, darkModeEnabled, toggleSound, toggleSpeaking, toggleDarkMode } = useSettings()

  const router = useRouter()

  const fetchProfile = async (uid: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/progress/user/${uid}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Read cookie
    const cookies = document.cookie.split("; ")
    const uidCookie = cookies.find(row => row.startsWith("userId="))
    const uid = uidCookie ? uidCookie.split("=")[1] : "0"
    setUserId(uid)
    if (uid !== "0") {
      fetchProfile(uid)
    } else {
      setLoading(false)
    }

    // Load mock gems
    const savedGems = localStorage.getItem("mock_gems")
    if (savedGems) {
      setGems(parseInt(savedGems))
    } else {
      setGems(1000)
      localStorage.setItem("mock_gems", "1000")
    }
  }, [])

  const handleBuyHeart = async () => {
    if (userId === "0" || gems < 100 || user.hearts >= 5) return

    // Deduct mock gems
    const newGems = gems - 100
    setGems(newGems)
    localStorage.setItem("mock_gems", newGems.toString())

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/progress/buy-heart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(userId) })
      })
      if (res.ok) {
        fetchProfile(userId) // refresh the UI
      } else {
        // Revert gems if backend fails
        setGems(gems)
        localStorage.setItem("mock_gems", gems.toString())
      }
    } catch (error) {
      console.error(error)
      setGems(gems)
      localStorage.setItem("mock_gems", gems.toString())
    }
  }

  const handleSignOut = () => {
    document.cookie = 'userId=; Max-Age=-99999999; path=/';
    router.push("/learn");
    setTimeout(() => window.location.reload(), 100);
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pt-20">
        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
      </div>
    )
  }

  if (userId === "0" || !user) {
    return (
      <div className="flex h-full flex-col items-center justify-center pt-20">
        <h1 className="text-2xl font-bold text-slate-700">No Profile Found</h1>
        <p className="text-slate-500">Please complete the first lesson to create a profile.</p>
      </div>
    )
  }

  const completedSkills = user.completed_skills || []
  const hasBasics = completedSkills.includes("Basics")
  const hasPhrases = completedSkills.includes("Phrases")
  const hasQuiz = completedSkills.includes("Phrases Quiz")
  const hasAll = hasBasics && hasPhrases && hasQuiz

  const achievements = [
    {
      title: "Wildfire",
      description: "Reach a 3 day streak",
      progress: Math.min((user.streak / 3) * 100, 100),
      color: "text-orange-500",
      bg: "bg-orange-400"
    },
    {
      title: "First Steps",
      description: "Complete any lesson",
      progress: user.total_xp >= 15 ? 100 : 0,
      color: "text-emerald-500",
      bg: "bg-emerald-400"
    },
    {
      title: "Basics Master",
      description: "Complete the Basics skill",
      progress: hasBasics ? 100 : 0,
      color: "text-blue-500",
      bg: "bg-blue-400"
    },
    {
      title: "Phrase Master",
      description: "Complete the Phrases skill",
      progress: hasPhrases ? 100 : 0,
      color: "text-purple-500",
      bg: "bg-purple-400"
    },
    {
      title: "Quiz Master",
      description: "Complete the Phrases Quiz",
      progress: hasQuiz ? 100 : 0,
      color: "text-pink-500",
      bg: "bg-pink-400"
    },
    {
      title: "Completionist",
      description: "Complete all skills",
      progress: hasAll ? 100 : 0,
      color: "text-yellow-500",
      bg: "bg-yellow-400"
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center pt-20 px-6 max-w-[600px] mx-auto dark:bg-[#131f24] min-h-[100dvh]">
      <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl font-extrabold text-slate-400 dark:text-slate-300">{user.username[0].toUpperCase()}</span>
      </div>
      <h1 className="text-3xl font-extrabold text-slate-700 dark:text-slate-100 mb-10">{user.username}</h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 pb-24">
        <div className="bg-white dark:bg-[#131f24] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2 text-yellow-500">
            <Zap className="w-8 h-8 fill-yellow-500" />
            <span className="text-2xl font-bold">Total XP</span>
          </div>
          <span className="text-4xl font-extrabold text-slate-700 dark:text-slate-100">{user.total_xp}</span>
        </div>

        <div className="bg-white dark:bg-[#131f24] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2 text-orange-500">
            <Flame className="w-8 h-8 fill-orange-500" />
            <span className="text-2xl font-bold">Day Streak</span>
          </div>
          <span className="text-4xl font-extrabold text-slate-700 dark:text-slate-100">{user.streak}</span>
        </div>
        <div className="bg-white dark:bg-[#131f24] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2 text-[#1cb0f6]">
            <Gem className="w-8 h-8 text-[#1cb0f6]" />
            <span className="text-2xl font-bold">Gems</span>
          </div>
          <span className="text-4xl font-extrabold text-slate-700 dark:text-slate-100">{gems}</span>
        </div>
        
        <div className="bg-white dark:bg-[#131f24] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-y-4">
          <div className="flex flex-col items-center gap-y-2">
            <div className="flex items-center gap-x-2 text-rose-500">
              <Heart className="w-8 h-8 fill-rose-500" />
              <span className="text-2xl font-bold">Hearts</span>
            </div>
            <span className="text-4xl font-extrabold text-slate-700 dark:text-slate-100">{user.hearts}/5</span>
          </div>
          
          {user.hearts < 5 && (
            <Button 
              onClick={handleBuyHeart} 
              variant="primary" 
              size="lg" 
              className="mt-4 w-full flex items-center justify-center gap-x-2"
              disabled={gems < 100}
            >
              <span>+1</span>
              <Heart className="w-5 h-5 fill-white" />
              <span>(100 💎)</span>
            </Button>
          )}
        </div>

        {/* Daily Goal Section */}
        <div className="md:col-span-2 mt-4">
          <DailyGoal />
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-[#131f24] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col gap-y-4 md:col-span-2 mt-4">
          <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-700 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-700 dark:text-slate-100">Achievements</h2>
          </div>
          <div className="flex flex-col gap-y-6 pt-2">
            {achievements.map((a, i) => (
              <div key={i} className="flex items-center gap-x-4">
                <Trophy className={`w-12 h-12 ${a.progress === 100 ? a.color : 'text-slate-300 dark:text-slate-600'}`} />
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-slate-700 dark:text-slate-100">{a.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold">{a.description}</p>
                  <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${a.bg} transition-all`} style={{ width: `${a.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Interactive Mockup */}
        <div 
          onClick={() => setShowSettings(!showSettings)}
          className="bg-white dark:bg-[#131f24] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col justify-between md:col-span-2 mt-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-4">
              <Settings className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              <h2 className="text-xl font-extrabold text-slate-700 dark:text-slate-100">Settings</h2>
            </div>
            <button className="bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-300 font-bold py-2 px-6 rounded-xl border-b-4 border-slate-300 dark:border-slate-600">
              {showSettings ? "CLOSE" : "OPEN"}
            </button>
          </div>
          
          {showSettings && (
            <div className="mt-6 flex flex-col gap-y-4 border-t-2 border-slate-200 dark:border-slate-700 pt-6 cursor-default" onClick={e => e.stopPropagation()}>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-100">Sound Effects</span>
                <div 
                  onClick={() => toggleSound()}
                  className={`w-12 h-6 rounded-full relative cursor-pointer border-2 transition-colors ${soundEnabled ? 'bg-[#58cc02] border-[#58cc02]' : 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${soundEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-100">Speaking Exercises</span>
                <div 
                  onClick={() => toggleSpeaking()}
                  className={`w-12 h-6 rounded-full relative cursor-pointer border-2 transition-colors ${speakingEnabled ? 'bg-[#58cc02] border-[#58cc02]' : 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${speakingEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-100">Dark Mode</span>
                <div 
                  onClick={() => toggleDarkMode()}
                  className={`w-12 h-6 rounded-full relative cursor-pointer border-2 transition-colors ${darkModeEnabled ? 'bg-[#58cc02] border-[#58cc02]' : 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${darkModeEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </div>

            </div>
          )}
        </div>
        
        {/* Sign Out */}
        <div className="md:col-span-2 mt-4 flex justify-center">
          <Button onClick={handleSignOut} variant="danger" size="lg" className="w-full">
            SIGN OUT / RESTART
          </Button>
        </div>

      </div>
    </div>
  )
}

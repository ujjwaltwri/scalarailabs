"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, Trophy, User, Store } from "lucide-react"
import { usePathname } from "next/navigation"

type Props = {
  className?: string
}

export const Sidebar = ({ className }: Props) => {
  const pathname = usePathname()
  
  return (
    <div className={cn("flex h-full bg-white dark:bg-[#131f24] lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 dark:border-slate-800 flex-col", className)}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <h1 className="text-2xl font-extrabold text-[#58cc02] tracking-wide">
            duolingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <Link href="/learn" className={`flex items-center gap-x-4 rounded-xl px-4 py-3 font-bold border-2 ${pathname === '/learn' ? 'bg-[#ddf4c5] text-[#58cc02] border-[#58cc02] dark:bg-green-900/30 dark:border-green-800 dark:text-green-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent'}`}>
          <Home className="w-6 h-6" />
          Learn
        </Link>
        <Link href="/leaderboard" className={`flex items-center gap-x-4 rounded-xl px-4 py-3 font-bold border-2 ${pathname === '/leaderboard' ? 'bg-[#ddf4ff] text-[#1cb0f6] border-[#1cb0f6] dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent'}`}>
          <Trophy className="w-6 h-6" />
          Leaderboard
        </Link>
        <Link href="/shop" className={`flex items-center gap-x-4 rounded-xl px-4 py-3 font-bold border-2 ${pathname === '/shop' ? 'bg-[#ffedc5] text-[#ffc800] border-[#ffc800] dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent'}`}>
          <Store className="w-6 h-6" />
          Shop
        </Link>
        <Link href="/profile" className={`flex items-center gap-x-4 rounded-xl px-4 py-3 font-bold border-2 ${pathname === '/profile' ? 'bg-[#ffe2f1] text-[#ff4b4b] border-[#ff4b4b] dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent'}`}>
          <User className="w-6 h-6" />
          Profile
        </Link>
      </div>
    </div>
  )
}

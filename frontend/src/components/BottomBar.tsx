"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, Trophy, User, Store } from "lucide-react"
import { usePathname } from "next/navigation"

type Props = {
  className?: string
}

export const BottomBar = ({ className }: Props) => {
  const pathname = usePathname()

  return (
    <nav className={cn("fixed bottom-0 w-full h-[70px] border-t-2 dark:border-slate-800 bg-white dark:bg-[#131f24] flex items-center justify-around px-6 z-50", className)}>
      <Link href="/learn" className={`flex flex-col items-center p-2 rounded-xl transition-colors ${pathname === '/learn' ? 'text-[#58cc02] bg-[#ddf4c5] dark:bg-green-900/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
        <Home className="w-7 h-7" />
      </Link>
      <Link href="/leaderboard" className={`flex flex-col items-center p-2 rounded-xl transition-colors ${pathname === '/leaderboard' ? 'text-[#1cb0f6] bg-[#ddf4ff] dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
        <Trophy className="w-7 h-7" />
      </Link>
      <Link href="/shop" className={`flex flex-col items-center p-2 rounded-xl transition-colors ${pathname === '/shop' ? 'text-[#ffc800] bg-[#ffedc5] dark:bg-yellow-900/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
        <Store className="w-7 h-7" />
      </Link>
      <Link href="/profile" className={`flex flex-col items-center p-2 rounded-xl transition-colors ${pathname === '/profile' ? 'text-[#ff4b4b] bg-[#ffe2f1] dark:bg-rose-900/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
        <User className="w-7 h-7" />
      </Link>
    </nav>
  )
}

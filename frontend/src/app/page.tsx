"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OwlMascot } from "@/components/OwlMascot"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-white dark:bg-[#131f24] flex flex-col overflow-hidden relative">
      {/* Top Header */}
      <header className="h-[70px] w-full border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-center lg:justify-start px-8 absolute top-0 z-10 bg-white/90 dark:bg-[#131f24]/90 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-[#58cc02] tracking-wide">
          duolingo
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 gap-10 mt-[70px] max-w-[1056px] mx-auto w-full">
        {/* Left: Mascot Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6 
          }}
          className="flex-1 flex justify-center items-center relative"
        >
          {/* Subtle glow behind the owl */}
          <div className="absolute w-[300px] h-[300px] bg-green-400/20 dark:bg-green-500/10 blur-3xl rounded-full" />
          <OwlMascot className="w-[280px] h-[280px] lg:w-[424px] lg:h-[424px] drop-shadow-2xl z-10" />
        </motion.div>

        {/* Right: Copy & CTA */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-y-8"
        >
          <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-700 dark:text-slate-100 max-w-[480px] leading-tight tracking-tight">
            The free, fun, and effective way to learn a language!
          </h1>
          
          <div className="flex flex-col gap-y-4 w-full max-w-[330px]">
            <Link href="/learn" className="w-full">
              <Button 
                size="lg" 
                variant="primary" 
                className="w-full h-14 text-lg hover:scale-105 transition-transform"
              >
                GET STARTED
              </Button>
            </Link>
            
            <Link href="/login" className="w-full">
              <Button 
                size="lg" 
                variant="ghost" 
                className="w-full h-14 text-lg bg-white dark:bg-[#131f24] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                I ALREADY HAVE AN ACCOUNT
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Decorative Bottom Wave (Optional, but looks nice for duolingo aesthetic) */}
      <div className="w-full h-[150px] bg-slate-100 dark:bg-[#18252a] flex items-center justify-center border-t-2 border-slate-200 dark:border-slate-800">
        <p className="text-slate-400 dark:text-slate-500 font-bold tracking-widest text-sm">
          CLONE FOR SCALAR AI LABS ASSESMENT
        </p>
      </div>
    </div>
  )
}

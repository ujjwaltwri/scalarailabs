"use client"
import { useState, useRef, useEffect } from "react"
import { SkillType } from "./page"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Star, Check, Lock, Play, Timer } from "lucide-react"

type Props = {
  skill: SkillType
}

import { motion, AnimatePresence } from "framer-motion"

export const SkillNode = ({ skill }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const isLocked = skill.status === "LOCKED";
  const isAvailable = skill.status === "AVAILABLE";
  const isCompleted = skill.status === "COMPLETED";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-[100px] h-[100px] inline-flex items-center justify-center" ref={nodeRef}>
      <AnimatePresence>
        {/* Tooltip title */}
        {!showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-max text-center z-40"
          >
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide bg-white dark:bg-[#18252a] px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700">
              {skill.title}
            </span>
            {/* Tooltip triangle */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 border-r-2 border-b-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18252a] rotate-45" />
          </motion.div>
        )}

        {/* Popover Menu */}
        {showMenu && !isLocked && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: 10, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute -top-[140px] left-1/2 w-[220px] bg-white dark:bg-[#18252a] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-y-3"
          >
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-100 text-center">{skill.title}</h3>
            
            <Link href={`/lesson/${skill.id}`} className="w-full">
              <button className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-bold py-2 rounded-xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-x-2">
                <Play className="w-5 h-5 fill-white" />
                START
              </button>
            </Link>
            
            <Link href={`/lesson/${skill.id}?mode=timed`} className="w-full">
              <button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded-xl border-b-4 border-rose-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-x-2 text-sm">
                <Timer className="w-5 h-5" />
                LEGENDARY
              </button>
            </Link>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 border-r-2 border-b-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18252a] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Ring SVG */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full -rotate-90">
          {/* Track */}
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            strokeWidth="8" 
            fill="none" 
            className="stroke-slate-200 dark:stroke-slate-700"
          />
          {/* Fill */}
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            strokeWidth="8" 
            fill="none" 
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000",
              isCompleted ? "stroke-yellow-400" : isAvailable ? "stroke-green-500" : "stroke-transparent"
            )}
            style={{ 
              strokeDasharray: 276.46,
              strokeDashoffset: isCompleted ? 0 : isAvailable ? 276.46 * 0.8 : 276.46 
            }}
          />
        </svg>
      </div>

      <div className="z-10 block" onClick={() => !isLocked && setShowMenu(true)}>
        <button
          className={cn(
            "relative w-[72px] h-[72px] rounded-full flex items-center justify-center border-b-[6px] transition-transform",
            isLocked && "bg-slate-200 border-slate-300 dark:bg-slate-700 dark:border-slate-800 opacity-50 cursor-not-allowed",
            isAvailable && "bg-green-500 border-green-600 hover:-translate-y-1 active:translate-y-1 active:border-b-0",
            isCompleted && "bg-yellow-400 border-yellow-500 hover:-translate-y-1 active:translate-y-1 active:border-b-0"
          )}
        >
          {/* Inner Node Icon */}
          <div className="w-[50px] h-[50px] bg-white dark:bg-[#131f24] rounded-full flex items-center justify-center">
            {isLocked && <Lock className="text-slate-400 dark:text-slate-500 w-6 h-6" />}
            {isAvailable && <Star className="text-green-500 fill-green-500 w-7 h-7" />}
            {isCompleted && <Check className="text-yellow-500 w-8 h-8" strokeWidth={4} />}
          </div>
        </button>
      </div>
    </div>
  )
}

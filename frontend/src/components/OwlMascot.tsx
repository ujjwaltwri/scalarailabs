import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  mood?: "happy" | "sad" | "default";
};

export const OwlMascot = ({ className, mood = "default" }: Props) => {
  // We'll use a playful SVG that resembles an owl
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("w-24 h-24", className)}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <path 
        d="M20 50C20 30 35 15 50 15C65 15 80 30 80 50V75C80 80 75 85 70 85H30C25 85 20 80 20 75V50Z" 
        fill={mood === "sad" ? "#94a3b8" : "#58cc02"} 
      />
      {/* Belly */}
      <path 
        d="M30 55C30 45 40 40 50 40C60 40 70 45 70 55V75C70 80 65 85 50 85C35 85 30 80 30 75V55Z" 
        fill={mood === "sad" ? "#cbd5e1" : "#7ade23"} 
      />
      
      {/* Eyes */}
      <circle cx="40" cy="40" r="10" fill="white" />
      <circle cx="60" cy="40" r="10" fill="white" />
      
      {/* Pupils */}
      {mood === "sad" ? (
        <>
          <circle cx="40" cy="42" r="4" fill="#334155" />
          <circle cx="60" cy="42" r="4" fill="#334155" />
          <path d="M35 32 L45 35" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <path d="M65 32 L55 35" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : mood === "happy" ? (
        <>
          <path d="M36 40 Q40 36 44 40" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M56 40 Q60 36 64 40" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="42" cy="40" r="4" fill="#1e293b" />
          <circle cx="58" cy="40" r="4" fill="#1e293b" />
        </>
      )}

      {/* Beak */}
      <path d="M47 48 L53 48 L50 53 Z" fill="#ffc800" />
      
      {/* Feet */}
      <path d="M35 85 C30 90 40 90 40 85 Z" fill="#ff9600" />
      <path d="M65 85 C60 90 70 90 60 85 Z" fill="#ff9600" />
    </svg>
  );
};

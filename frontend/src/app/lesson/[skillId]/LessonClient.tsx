"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Heart, Volume2, Timer } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { OwlMascot } from "@/components/OwlMascot"
import { useSettings } from "@/components/SettingsProvider"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"

type Exercise = {
  id: number;
  type: string;
  question_data: any;
  answer_data: any;
}

type Lesson = {
  id: number;
  skill_id: number;
  exercises: Exercise[];
}

export const LessonClient = ({ lesson, userId }: { lesson: Lesson, userId: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hearts, setHearts] = useState(5)
  const { soundEnabled, speakingEnabled } = useSettings()
  
  const searchParams = useSearchParams()
  const isTimed = searchParams.get("mode") === "timed"
  const [timeLeft, setTimeLeft] = useState(60)
  
  // Exercise states
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [textAnswer, setTextAnswer] = useState("")
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState<string[]>([])
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null)
  
  // Ref for tracking button elements to draw lines between them
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [lines, setLines] = useState<{x1: number, y1: number, x2: number, y2: number}[]>([]);

  const [status, setStatus] = useState<"none" | "correct" | "incorrect">("none")
  
  const router = useRouter()
  const exercise = lesson.exercises[currentIndex]

  // Timer logic for Legendary Mode
  useEffect(() => {
    if (isTimed && status === "none" && exercise && hearts > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setHearts(0) // auto fail
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isTimed, status, exercise, hearts])

  // Sound effects logic
  const playSound = (type: "correct" | "incorrect") => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (type === "correct") {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5 + (i * 0.1));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + (i * 0.05));
          osc.stop(ctx.currentTime + 1);
        });
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch(e) {
      console.error("Audio Context failed", e);
    }
  }

  // Effect to update lines when matchedPairs changes
  useEffect(() => {
    if (exercise?.type !== "match_pairs" || !containerRef.current) return;
    
    const newLines = [];
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // matchedPairs are stored in pairs [id1, id2, id3, id4]
    for (let i = 0; i < matchedPairs.length; i += 2) {
      const id1 = matchedPairs[i];
      const id2 = matchedPairs[i + 1];
      const el1 = buttonRefs.current.get(id1);
      const el2 = buttonRefs.current.get(id2);
      
      if (el1 && el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        
        newLines.push({
          x1: rect1.left + rect1.width / 2 - containerRect.left,
          y1: rect1.top + rect1.height / 2 - containerRect.top,
          x2: rect2.left + rect2.width / 2 - containerRect.left,
          y2: rect2.top + rect2.height / 2 - containerRect.top
        });
      }
    }
    setLines(newLines);
  }, [matchedPairs, exercise]);

  useEffect(() => {
    if (!exercise) {
      if (userId === 0) {
        // Anonymous user just finished the learning session, send them to register
        setTimeout(() => router.push("/register?finished_intro=true"), 2500)
      } else {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/progress/lesson-complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, skill_id: lesson.skill_id, xp_earned: 15 })
        }).then(res => {
          if (!res.ok && res.status === 404) {
             document.cookie = 'userId=; Max-Age=-99999999; path=/';
             setTimeout(() => router.push("/register`), 2500)
          }
        }).catch(err => console.error("Failed to save progress:", err))
      }

      // Fire confetti
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

    }
  }, [exercise, lesson.skill_id, userId, router])

  const playAudio = (text: string, force: boolean = false) => {
    if (!speakingEnabled && !force) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  }

  // Auto-play audio when exercise loads if speaking is enabled
  useEffect(() => {
    if (speakingEnabled && exercise && status === "none") {
      let textToRead = "";
      if (exercise.type === "info" && exercise.question_data.concept) textToRead = exercise.question_data.concept;
      else if (exercise.question_data.sentence) textToRead = exercise.question_data.sentence;
      else if (exercise.type === "multiple_choice" && exercise.question_data.question) textToRead = exercise.question_data.question;
      
      if (textToRead) {
        playAudio(textToRead);
      }
    }
  }, [exercise, speakingEnabled, status]);
  
  if (!exercise) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex flex-col items-center justify-center h-[100dvh] w-full bg-white dark:bg-[#131f24] fixed inset-0 z-50 px-6"
      >
        <OwlMascot mood="happy" className="w-48 h-48 mb-8 drop-shadow-xl" />
        <h1 className="text-4xl font-black text-[#58cc02] text-center mb-4">Lesson Complete!</h1>
        <p className="text-xl font-bold text-slate-500 dark:text-slate-400 text-center mb-12">You've earned 15 XP and maintained your streak.</p>
        <Button size="lg" variant="primary" className="w-full max-w-[400px] hover:scale-105 transition-transform" onClick={() => router.push(userId === 0 ? "/register` : "/learn")}>
          CONTINUE
        </Button>
      </motion.div>
    )
  }

  if (hearts === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] w-full bg-slate-50 dark:bg-[#131f24] fixed inset-0 z-50 px-6 animate-in fade-in duration-500">
        <OwlMascot mood="sad" className="w-48 h-48 mb-8" />
        <h1 className="text-4xl font-black text-rose-500 text-center mb-4">{timeLeft === 0 ? "Time's Up!" : "Out of Hearts!"}</h1>
        <p className="text-xl font-bold text-slate-500 dark:text-slate-400 text-center mb-12">{timeLeft === 0 ? "You ran out of time in Legendary mode." : "You need hearts to continue learning. Go to the shop to refill."}</p>
        <Button size="lg" variant="primary" className="w-full max-w-[400px]" onClick={() => router.push("/learn")}>
          GO BACK
        </Button>
      </div>
    )
  }

  const progressPercentage = (currentIndex / lesson.exercises.length) * 100

  const onCheck = () => {
    if (status === "correct" || status === "incorrect") {
      setStatus("none")
      setSelectedAnswer(null)
      setTextAnswer("")
      setSelectedWords([])
      setMatchedPairs([])
      setSelectedPairId(null)
      setCurrentIndex(prev => prev + 1)
      return
    }

    if (exercise.type === "info") {
      setCurrentIndex(prev => prev + 1)
      return
    }

    let isCorrect = false;

    if (exercise.type === "multiple_choice" || exercise.type === "fill_in_the_blank") {
      isCorrect = selectedAnswer === exercise.answer_data.correct_answer
    } else if (exercise.type === "translate") {
      isCorrect = selectedWords.join(" ") === exercise.answer_data.correct_answer
    } else if (exercise.type === "type_the_answer") {
      isCorrect = textAnswer.toLowerCase().trim() === exercise.answer_data.correct_answer.toLowerCase()
    } else if (exercise.type === "match_pairs") {
      isCorrect = matchedPairs.length === (exercise.question_data.pairs.length * 2)
    }

    if (isCorrect) {
      setStatus("correct")
      playSound("correct")
    } else {
      setStatus("incorrect")
      playSound("incorrect")
      setHearts(prev => Math.max(0, prev - 1))
      if (userId !== 0) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/progress/heart-lost`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId })
        }).then(res => {
          if (!res.ok && res.status === 404) {
            document.cookie = 'userId=; Max-Age=-99999999; path=/';
          }
        }).catch(err => console.error("Failed to sync heart loss:", err))
      }
    }
  }

  const handlePairClick = (word: string, id: string) => {
    if (matchedPairs.includes(id)) return;

    if (!selectedPairId) {
      setSelectedPairId(id);
      return;
    }

    const isMatch = exercise.question_data.pairs.find((p: any) => 
      (p.en === selectedPairId && p.es === id) || (p.es === selectedPairId && p.en === id)
    );

    if (isMatch) {
      setMatchedPairs(prev => [...prev, id, selectedPairId]);
    }
    setSelectedPairId(null);
  }



  const isCheckDisabled = () => {
    if (status !== "none") return false;
    if (exercise.type === "info") return false;
    if (exercise.type === "multiple_choice" || exercise.type === "fill_in_the_blank") return !selectedAnswer;
    if (exercise.type === "translate") return selectedWords.length === 0;
    if (exercise.type === "type_the_answer") return textAnswer.length === 0;
    if (exercise.type === "match_pairs") return matchedPairs.length < (exercise.question_data.pairs.length * 2);
    return true;
  }

  // Get shuffled pairs safely
  const pairsForDisplay = exercise.type === "match_pairs" 
    ? exercise.question_data.pairs.flatMap((p: any) => [
        { id: p.en, text: p.en },
        { id: p.es, text: p.es }
      ]) // in a real app, shuffle this array
    : [];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#131f24] min-h-[100dvh]">
      <header className="pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
        <button onClick={() => router.push("/learn")} className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 transition">
          <X className="h-8 w-8" strokeWidth={3} />
        </button>
        
        {isTimed ? (
          <div className="flex-1 flex justify-center items-center gap-x-2 text-2xl font-black text-rose-500 animate-pulse">
            <Timer className="h-8 w-8" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        ) : (
          <div className="h-4 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-[#58cc02] transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
          </div>
        )}

        <div className="text-rose-500 font-bold text-xl flex items-center gap-x-2">
          <Heart className="h-7 w-7 fill-rose-500" />
          {hearts}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-[600px] w-full mx-auto px-6">
        <h1 className="text-2xl font-extrabold text-slate-700 dark:text-slate-100 self-start mb-8">
          {exercise.type === "info" && "Learning Session"}
          {exercise.type === "multiple_choice" && "Select the correct meaning"}
          {exercise.type === "translate" && "Translate this sentence"}
          {exercise.type === "fill_in_the_blank" && "Fill in the blank"}
          {exercise.type === "type_the_answer" && "Type the answer in Spanish"}
          {exercise.type === "match_pairs" && "Tap the matching pairs"}
        </h1>

        <div className="w-full">
          {exercise.type === "info" ? (
            <div className="bg-white dark:bg-[#131f24] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center gap-y-4">
               <Button onClick={() => playAudio(exercise.question_data.concept, true)} variant="ghost" className="h-16 w-16 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                 <Volume2 className="h-10 w-10 text-blue-400" />
               </Button>
               <span className="text-4xl font-black text-slate-700 dark:text-slate-100">{exercise.question_data.concept}</span>
               <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">= {exercise.question_data.meaning}</span>
            </div>
          ) : (
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-6 flex items-center gap-x-2">
              <span>{exercise.question_data.question || exercise.question_data.sentence}</span>
            </div>
          )}

          {(exercise.type === "multiple_choice" || exercise.type === "fill_in_the_blank") && (
            <div className="grid grid-cols-1 gap-y-4">
              {exercise.question_data.options?.map((option: string) => (
                <Button 
                  key={option}
                  variant={selectedAnswer === option ? "primary" : "secondary"}
                  size="lg"
                  className={cn(
                    "w-full justify-start border-2 border-b-4 h-16 px-6 text-xl font-bold transition-colors",
                    selectedAnswer === option 
                      ? "border-blue-400 bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18252a] hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={status !== "none"}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {exercise.type === "translate" && (
            <div className="flex flex-col gap-y-8">
              <div className="border-b-2 border-slate-200 dark:border-slate-700 min-h-[60px] pb-2 flex flex-wrap gap-2">
                {selectedWords.map((word, i) => (
                  <Button key={i} variant="secondary" size="lg" className="text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#18252a] border-slate-200 dark:border-slate-700" onClick={() => setSelectedWords(prev => prev.filter((_, idx) => idx !== i))}>
                    {word}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {exercise.question_data.word_bank?.map((word: string) => (
                  <Button 
                    key={word} 
                    variant="secondary" 
                    size="lg"
                    className="text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#18252a] border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                    disabled={selectedWords.includes(word)}
                    onClick={() => setSelectedWords(prev => [...prev, word])}
                  >
                    {word}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {exercise.type === "type_the_answer" && (
            <textarea 
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 font-bold text-xl text-slate-700 dark:text-slate-100 resize-none outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
              rows={4}
              placeholder="Type in Spanish..."
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={status !== "none"}
            />
          )}

          {exercise.type === "match_pairs" && (
            <div className="relative" ref={containerRef}>
              {/* SVG overlay for lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: "visible" }}>
                {lines.map((line, i) => (
                  <line 
                    key={i} 
                    x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
                    stroke="#58cc02" strokeWidth="4" strokeLinecap="round"
                    className="animate-in fade-in duration-300"
                  />
                ))}
              </svg>
              
              <div className="grid grid-cols-2 gap-4 relative z-0">
                {pairsForDisplay.map((item: any) => (
                  <Button
                    key={item.id}
                    ref={(el) => { if (el) buttonRefs.current.set(item.id, el) }}
                    variant={matchedPairs.includes(item.id) ? "ghost" : selectedPairId === item.id ? "primary" : "secondary"}
                    className={cn(
                      "h-16 text-lg font-bold transition-colors duration-300", 
                      matchedPairs.includes(item.id) 
                        ? "bg-green-100 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-800 dark:text-green-500" 
                        : selectedPairId === item.id 
                          ? "bg-blue-100 border-blue-400 text-blue-500 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-200 bg-white dark:bg-[#18252a] border-slate-200 dark:border-slate-700"
                    )}
                    onClick={() => handlePairClick(item.text, item.id)}
                    disabled={matchedPairs.includes(item.id) || status !== "none"}
                  >
                    {item.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer with Framer Motion drawer */}
      <AnimatePresence>
        {status !== "none" && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed bottom-0 left-0 w-full border-t-2 h-[140px] flex items-center px-6 z-50",
              status === "correct" ? "bg-green-100 border-green-200 dark:bg-green-900/90 dark:border-green-800" : "bg-rose-100 border-rose-200 dark:bg-rose-900/90 dark:border-rose-800"
            )}
          >
            <div className="max-w-[1140px] mx-auto w-full flex items-center justify-between">
              <div className="flex flex-col">
                 {status === "correct" && <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-x-2">Good job!</h2>}
                 {status === "incorrect" && <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-x-2">Incorrect.</h2>}
                 {status === "incorrect" && <p className="text-rose-500 dark:text-rose-300 text-lg font-semibold mt-1">Correct answer: {exercise.answer_data.correct_answer}</p>}
              </div>
              <Button 
                size="lg" 
                variant={status === "incorrect" ? "danger" : "primary"}
                className="w-[150px] hover:scale-105 transition-transform"
                onClick={onCheck}
                disabled={isCheckDisabled()}
              >
                CONTINUE
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static Footer when status is none */}
      {status === "none" && (
        <footer className="border-t-2 h-[140px] flex items-center px-6 bg-white dark:bg-[#131f24] border-slate-200 dark:border-slate-800">
          <div className="max-w-[1140px] mx-auto w-full flex items-center justify-between">
            <div className="flex flex-col"></div>
            <Button 
              size="lg" 
              variant="primary"
              className="w-[150px]"
              onClick={onCheck}
              disabled={isCheckDisabled()}
            >
              CHECK
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}

"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface SettingsContextType {
  soundEnabled: boolean
  speakingEnabled: boolean
  darkModeEnabled: boolean
  toggleSound: () => void
  toggleSpeaking: () => void
  toggleDarkMode: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [speakingEnabled, setSpeakingEnabled] = useState(false)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  // Load initial settings
  useEffect(() => {
    const sound = localStorage.getItem("setting_sound")
    const speaking = localStorage.getItem("setting_speaking")
    const dark = localStorage.getItem("setting_dark")

    if (sound !== null) setSoundEnabled(sound === "true")
    if (speaking !== null) setSpeakingEnabled(speaking === "true")
    if (dark !== null) {
      const isDark = dark === "true"
      setDarkModeEnabled(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  const toggleSound = () => {
    const val = !soundEnabled
    setSoundEnabled(val)
    localStorage.setItem("setting_sound", val.toString())
  }

  const toggleSpeaking = () => {
    const val = !speakingEnabled
    setSpeakingEnabled(val)
    localStorage.setItem("setting_speaking", val.toString())
  }

  const toggleDarkMode = () => {
    const val = !darkModeEnabled
    setDarkModeEnabled(val)
    localStorage.setItem("setting_dark", val.toString())
    if (val) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Prevent hydration mismatch on the HTML element by rendering kids only after mount if needed? 
  // Next.js might complain if we alter HTML class, but usually it's fine. We'll just provide context.

  return (
    <SettingsContext.Provider value={{ soundEnabled, speakingEnabled, darkModeEnabled, toggleSound, toggleSpeaking, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

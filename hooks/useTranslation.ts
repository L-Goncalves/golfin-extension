import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"
import translations from "~language.json"

const storage = new Storage()

export type Language = "english" | "portuguese"

// Global language state
let globalLanguage: Language = "portuguese"
const listeners = new Set<(lang: Language) => void>()

const notifyListeners = (language: Language) => {
  globalLanguage = language
  listeners.forEach(listener => listener(language))
}

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(globalLanguage)

  useEffect(() => {
    // Register this component as a listener
    listeners.add(setCurrentLanguage)
    
    const loadLanguage = async () => {
      try {
        const savedLanguage = await storage.get("selectedLanguage")
        if (savedLanguage && (savedLanguage === "english" || savedLanguage === "portuguese")) {
          notifyListeners(savedLanguage)
        }
      } catch (error) {
        console.error("Failed to load language:", error)
      }
    }
    loadLanguage()
    
    // Cleanup listener on unmount
    return () => {
      listeners.delete(setCurrentLanguage)
    }
  }, [])

  const changeLanguage = async (language: Language) => {
    try {
      await storage.set("selectedLanguage", language)
      notifyListeners(language)
    } catch (error) {
      console.error("Failed to save language:", error)
    }
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[currentLanguage]
    
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k]
      } else {
        return key // Return the key if translation not found
      }
    }
    
    return typeof value === "string" ? value : key
  }

  return { t, currentLanguage, changeLanguage }
}
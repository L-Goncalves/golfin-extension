import React from "react"
import { useTranslation, type Language } from "~hooks/useTranslation"
import "./LanguageSelector.scss"

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, t } = useTranslation()

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language)
  }

  return (
    <div className="language-selector">
      <label className="language-label">{t("language")}:</label>
      <div className="language-buttons">
        <button
          className={`language-button ${currentLanguage === "portuguese" ? "active" : ""}`}
          onClick={() => handleLanguageChange("portuguese")}
        >
          🇧🇷 PT
        </button>
        <button
          className={`language-button ${currentLanguage === "english" ? "active" : ""}`}
          onClick={() => handleLanguageChange("english")}
        >
          🇺🇸 EN
        </button>
      </div>
    </div>
  )
}
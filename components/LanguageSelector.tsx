"use client";

import { useState, useRef, useEffect } from "react";

const ALL_LANGUAGES = [
  "English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean",
  "Hindi", "Arabic", "Portuguese", "Russian", "Italian", "Dutch", "Turkish",
  "Bengali", "Urdu", "Indonesian", "Vietnamese", "Tamil", "Telugu", "Marathi",
  "Gujarati", "Punjabi", "Malayalam", "Kannada"
];

interface LanguageSelectorProps {
  languages: string[];
  onChange: (languages: string[]) => void;
}

export default function LanguageSelector({ languages, onChange }: LanguageSelectorProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input.trim()) {
      const filtered = ALL_LANGUAGES.filter(lang => 
        lang.toLowerCase().includes(input.toLowerCase()) && 
        !languages.includes(lang)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions(ALL_LANGUAGES.filter(lang => !languages.includes(lang)).slice(0, 5));
    }
  }, [input, languages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addLanguage = (lang: string) => {
    if (!languages.includes(lang)) {
      onChange([...languages, lang]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeLanguage = (lang: string) => {
    onChange(languages.filter(l => l !== lang));
  };

  return (
    <div className="space-y-3" ref={wrapperRef}>
      <label className="block text-sm font-medium">Languages You Speak</label>
      
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {languages.map(lang => (
          <span 
            key={lang} 
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
          >
            {lang}
            <button 
              onClick={() => removeLanguage(lang)}
              className="hover:text-cyan-800 dark:hover:text-cyan-200 transition-colors ml-1"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="input-premium w-full px-4 py-3 rounded-xl"
          placeholder="Type to search languages (e.g. Hindi, English)..."
          onKeyDown={e => {
            if (e.key === 'Enter' && suggestions.length > 0) {
              e.preventDefault();
              addLanguage(suggestions[0]);
            }
          }}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-xl border shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
            {suggestions.map(lang => (
              <li 
                key={lang}
                onClick={() => addLanguage(lang)}
                className="px-4 py-2 cursor-pointer transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {lang}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { UtensilsCrossed, Sparkles, SlidersHorizontal, Users } from 'lucide-react';
import { UserPreferences } from '../types/meal';

interface HeaderProps {
  preferences: UserPreferences;
  onOpenPreferences: () => void;
  onUpdateServings: (servings: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onOpenPreferences,
  onUpdateServings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8]/60 px-4 py-3 sm:px-6 transition-all">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* App Title and South Indian Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A84B2C] to-[#E07A5F] flex items-center justify-center text-white shadow-md shadow-[#A84B2C]/20 flex-shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2D241E] font-display">
                Enna Samayal?
              </h1>
              <span className="hidden xs:inline-block px-2 py-0.5 text-[11px] font-semibold bg-[#2A5A3B]/10 text-[#2A5A3B] rounded-full border border-[#2A5A3B]/20">
                தென்னிந்திய சமையல்
              </span>
            </div>
            <p className="text-xs text-[#7A6A5D] line-clamp-1">
              Your everyday South Indian cooking assistant
            </p>
          </div>
        </div>

        {/* Action controls: Servings and Preferences */}
        <div className="flex items-center space-x-2">
          {/* Quick servings counter pill */}
          <div className="flex items-center bg-[#F3ECE2] border border-[#E2D5C3] rounded-full px-2.5 py-1 text-xs font-semibold text-[#5A4B3E]">
            <Users className="w-3.5 h-3.5 mr-1.5 text-[#A84B2C]" />
            <select
              aria-label="Number of servings"
              value={preferences.servings}
              onChange={(e) => onUpdateServings(Number(e.target.value))}
              className="bg-transparent text-[#2D241E] font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value={1}>1 person</option>
              <option value={2}>2 people</option>
              <option value={4}>4 people</option>
              <option value={6}>6 people</option>
              <option value={8}>8 people</option>
            </select>
          </div>

          {/* Preferences button */}
          <button
            onClick={onOpenPreferences}
            className="p-2 rounded-full bg-[#F3ECE2] hover:bg-[#EBE2D5] border border-[#E2D5C3] text-[#5A4B3E] transition-colors shadow-xs"
            title="Configure Preferences"
            aria-label="Preferences"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { 
  RefreshCw, BookOpen, ShoppingBag, Refrigerator, 
  Heart, CalendarPlus, Wand2, Send, Check, Sparkles 
} from 'lucide-react';
import { DailyMenu } from '../types/meal';

interface ActionToolbarProps {
  onRegenerateFullMenu: (customOverride?: string) => void;
  onOpenAllRecipes: () => void;
  onOpenShoppingList: () => void;
  onOpenIngredientsModal: () => void;
  onSaveMenu: () => void;
  onAddToWeeklyPlan: () => void;
  isGenerating: boolean;
  isSaved?: boolean;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onRegenerateFullMenu,
  onOpenAllRecipes,
  onOpenShoppingList,
  onOpenIngredientsModal,
  onSaveMenu,
  onAddToWeeklyPlan,
  isGenerating,
  isSaved = false,
}) => {
  const [customCommand, setCustomCommand] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim() || isGenerating) return;
    onRegenerateFullMenu(customCommand.trim());
    setCustomCommand('');
  };

  const sampleCommands = [
    "I don't want rice today",
    "I have only tomatoes, onions & potatoes",
    "Make dinner very light & simple",
    "I have only 30 minutes today",
    "Don't repeat yesterday's dishes"
  ];

  return (
    <div className="space-y-4 pt-1">
      {/* Primary Action Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onRegenerateFullMenu()}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl bg-[#A84B2C] hover:bg-[#8F3C20] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#A84B2C]/25 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Change Menu</span>
        </button>

        <button
          onClick={onOpenAllRecipes}
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl bg-white hover:bg-[#F7F2EB] text-[#2D241E] font-bold text-xs sm:text-sm border border-[#E2D5C3] shadow-xs transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#2A5A3B]" />
          <span>View Recipes</span>
        </button>

        <button
          onClick={onOpenShoppingList}
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl bg-white hover:bg-[#F7F2EB] text-[#2D241E] font-bold text-xs sm:text-sm border border-[#E2D5C3] shadow-xs transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-amber-700" />
          <span>Shopping List</span>
        </button>

        <button
          onClick={onOpenIngredientsModal}
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl bg-white hover:bg-[#F7F2EB] text-[#2D241E] font-bold text-xs sm:text-sm border border-[#E2D5C3] shadow-xs transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
        >
          <Refrigerator className="w-4 h-4 text-purple-700" />
          <span>Use My Ingredients</span>
        </button>
      </div>

      {/* Secondary utility actions: Save Menu & Add to Weekly Plan */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center space-x-3">
          <button
            onClick={onSaveMenu}
            className={`flex items-center space-x-1.5 font-semibold transition-colors cursor-pointer ${
              isSaved ? 'text-rose-600' : 'text-[#7A6A5D] hover:text-[#2D241E]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-rose-600' : ''}`} />
            <span>{isSaved ? 'Saved to Favorites' : 'Save Menu'}</span>
          </button>

          <button
            onClick={onAddToWeeklyPlan}
            className="flex items-center space-x-1.5 font-semibold text-[#7A6A5D] hover:text-[#2D241E] transition-colors cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-teal-700" />
            <span>Add to Weekly Plan</span>
          </button>
        </div>
      </div>

      {/* Natural Language User Override Section (Section 17) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label 
            htmlFor="custom-override-input" 
            className="text-xs font-bold text-[#4A3B2E] flex items-center space-x-1.5"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#A84B2C]" />
            <span>Customize or adjust this menu</span>
          </label>
          <span className="text-[10px] text-[#8A796C]">e.g. "I don't want rice"</span>
        </div>

        <form onSubmit={handleCustomSubmit} className="flex items-center space-x-2">
          <input
            id="custom-override-input"
            type="text"
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            placeholder="Tell AI what to change (e.g., 'Make dinner lighter', 'No potatoes')..."
            className="flex-1 bg-[#FAF7F2] border border-[#E2D5C3] rounded-xl px-3 py-2 text-xs text-[#2D241E] placeholder:text-[#9C8C7F] focus:outline-none focus:border-[#A84B2C] transition-colors"
          />
          <button
            type="submit"
            disabled={!customCommand.trim() || isGenerating}
            className="px-4 py-2 rounded-xl bg-[#2D241E] hover:bg-[#40332B] text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center space-x-1 cursor-pointer flex-shrink-0"
          >
            <Send className="w-3 h-3" />
            <span className="hidden xs:inline">Update</span>
          </button>
        </form>

        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {sampleCommands.map((cmd, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onRegenerateFullMenu(cmd)}
              disabled={isGenerating}
              className="flex-shrink-0 text-[11px] bg-[#F3ECE2] hover:bg-[#EBE2D5] text-[#5A4B3E] px-2.5 py-1 rounded-lg transition-colors border border-[#E2D5C3]/60 cursor-pointer disabled:opacity-50"
            >
              "{cmd}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

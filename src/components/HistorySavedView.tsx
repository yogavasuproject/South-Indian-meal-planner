import React, { useState } from 'react';
import { 
  History, Heart, Calendar, ArrowRight, Trash2, 
  Sparkles, CheckCircle2, RotateCcw, Clock, Users 
} from 'lucide-react';
import { DailyMenu, Dish } from '../types/meal';

interface HistorySavedViewProps {
  history: DailyMenu[];
  savedMenus: DailyMenu[];
  currentMenu: DailyMenu;
  onSelectMenuAsCurrent: (menu: DailyMenu) => void;
  onSelectDish: (dish: Dish) => void;
  onRegenerateAvoidingHistory: () => void;
  isLoading: boolean;
}

export const HistorySavedView: React.FC<HistorySavedViewProps> = ({
  history,
  savedMenus,
  currentMenu,
  onSelectMenuAsCurrent,
  onSelectDish,
  onRegenerateAvoidingHistory,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');

  const listToRender = activeTab === 'history' ? history : savedMenus;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#2D241E]">
            {activeTab === 'history' ? 'Recent Cooking History' : 'Saved Favorite Menus'}
          </h2>
          <p className="text-xs text-[#7A6A5D]">
            Track previous meals to avoid repeating dishes and re-cook household favorites
          </p>
        </div>

        {/* Regenerate Button to Avoid Recent Repeat */}
        <button
          onClick={onRegenerateAvoidingHistory}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#A84B2C] hover:bg-[#8F3C20] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Generate Something Completely Different</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8DFC8] bg-[#F3ECE2]/80 px-4 pt-2">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'history'
              ? 'border-[#A84B2C] text-[#A84B2C] bg-white rounded-t-xl'
              : 'border-transparent text-[#7A6A5D] hover:text-[#2D241E]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Past Menus ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'saved'
              ? 'border-[#A84B2C] text-[#A84B2C] bg-white rounded-t-xl'
              : 'border-transparent text-[#7A6A5D] hover:text-[#2D241E]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-600" />
          <span>Saved Favorites ({savedMenus.length})</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {listToRender.length > 0 ? (
          listToRender.map((item, idx) => {
            const isToday = item.id === currentMenu.id || item.title === currentMenu.title;

            return (
              <div
                key={item.id || idx}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      {isToday ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A5A3B] text-white">
                          Current Menu
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#7A6A5D]">
                          {idx === 0 ? 'Yesterday / Recent' : `${idx + 1} days ago`}
                        </span>
                      )}
                      <span className="text-[11px] text-[#A84B2C] font-semibold">
                        • {item.cuisine} style
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-display text-[#2D241E]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#7A6A5D]">
                      {item.theme}
                    </p>
                  </div>

                  {!isToday && (
                    <button
                      onClick={() => onSelectMenuAsCurrent(item)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#F3ECE2] hover:bg-[#EBE2D5] text-[#A84B2C] text-xs font-bold transition-all border border-[#E2D5C3] cursor-pointer"
                    >
                      <span>Load Menu</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Quick breakdown preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-[#F0E8DC]">
                  <div className="bg-[#FAF7F2] p-2 rounded-xl">
                    <span className="text-[10px] text-[#8A796C] block uppercase font-bold">Breakfast</span>
                    <span className="font-semibold text-[#2D241E] line-clamp-1">{item.breakfast?.title}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2 rounded-xl">
                    <span className="text-[10px] text-[#8A796C] block uppercase font-bold">Lunch</span>
                    <span className="font-semibold text-[#2D241E] line-clamp-1">{item.lunch?.title}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2 rounded-xl">
                    <span className="text-[10px] text-[#8A796C] block uppercase font-bold">Snack</span>
                    <span className="font-semibold text-[#2D241E] line-clamp-1">{item.snack?.title}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2 rounded-xl">
                    <span className="text-[10px] text-[#8A796C] block uppercase font-bold">Dinner</span>
                    <span className="font-semibold text-[#2D241E] line-clamp-1">{item.dinner?.title}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E8DFC8] text-[#7A6A5D] text-xs space-y-2">
            <Heart className="w-8 h-8 text-[#C8B8A6] mx-auto" />
            <p className="font-medium">No saved menus yet.</p>
            <p className="text-[11px]">Click the heart icon on any generated menu card to save it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

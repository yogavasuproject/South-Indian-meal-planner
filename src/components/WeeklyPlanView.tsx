import React, { useState } from 'react';
import { 
  Calendar, RefreshCw, ShoppingBag, ChevronRight, 
  CheckCircle2, Sparkles, Sun, Moon, Coffee, Heart, ArrowRight
} from 'lucide-react';
import { WeeklyPlan, DayPlan, DailyMenu, Dish } from '../types/meal';

interface WeeklyPlanViewProps {
  weeklyPlan: WeeklyPlan | null;
  onGenerateWeekly: () => void;
  isLoading: boolean;
  onSelectDayAsToday: (menu: DailyMenu) => void;
  onSelectDish: (dish: Dish) => void;
}

export const WeeklyPlanView: React.FC<WeeklyPlanViewProps> = ({
  weeklyPlan,
  onGenerateWeekly,
  isLoading,
  onSelectDayAsToday,
  onSelectDish,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [showWeeklyShopping, setShowWeeklyShopping] = useState(false);

  if (!weeklyPlan) {
    return (
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-8 text-center space-y-4 max-w-lg mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-[#A84B2C]/10 text-[#A84B2C] flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-display text-[#2D241E]">
            7-Day South Indian Meal Plan
          </h3>
          <p className="text-xs sm:text-sm text-[#7A6A5D] mt-1 max-w-sm mx-auto">
            Plan your entire week with smart culinary variety: rotating sambar, vatha kuzhambu, mor kuzhambu, variety tiffins, and greens.
          </p>
        </div>

        <button
          onClick={onGenerateWeekly}
          disabled={isLoading}
          className="px-6 py-3 rounded-2xl bg-[#A84B2C] hover:bg-[#8F3C20] text-white font-bold text-sm shadow-md shadow-[#A84B2C]/25 transition-all inline-flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Generating Weekly Variety...' : 'Generate 7-Day Plan'}</span>
        </button>
      </div>
    );
  }

  const currentDayPlan = weeklyPlan.days[selectedDayIdx] || weeklyPlan.days[0];
  const dayMenu = currentDayPlan.menu;

  return (
    <div className="space-y-4">
      {/* Weekly Plan Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#2D241E]">
            {weeklyPlan.title || '7-Day South Indian Meal Plan'}
          </h2>
          <p className="text-xs text-[#7A6A5D]">
            Zero-repetition balanced home cooking for the full week
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWeeklyShopping(!showWeeklyShopping)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#F3ECE2] hover:bg-[#EBE2D5] text-[#5A4B3E] text-xs font-bold transition-all flex items-center space-x-1.5 border border-[#E2D5C3]"
          >
            <ShoppingBag className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Weekly Groceries</span>
          </button>

          <button
            onClick={onGenerateWeekly}
            disabled={isLoading}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#A84B2C] hover:bg-[#8F3C20] text-white text-xs font-bold transition-all flex items-center space-x-1.5 disabled:opacity-50"
            title="Regenerate week"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
        </div>
      </div>

      {/* 7-Days Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {weeklyPlan.days.map((d, idx) => {
          const isSelected = selectedDayIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedDayIdx(idx);
                setShowWeeklyShopping(false);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2A5A3B] text-white shadow-sm'
                  : 'bg-white text-[#5A4B3E] border border-[#E2D5C3] hover:bg-[#FAF7F2]'
              }`}
            >
              <span>{d.dayName}</span>
            </button>
          );
        })}
      </div>

      {/* Weekly Shopping Mode */}
      {showWeeklyShopping ? (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
            <div>
              <h3 className="text-base font-bold font-display text-[#2D241E]">
                🛒 Consolidated 7-Day Grocery List
              </h3>
              <p className="text-xs text-[#7A6A5D]">
                Total provisions required for the entire week to prevent mid-week grocery runs
              </p>
            </div>
            <button
              onClick={() => setShowWeeklyShopping(false)}
              className="text-xs font-bold text-[#A84B2C] hover:underline"
            >
              Back to Daily Plan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {weeklyPlan.weeklyShoppingList?.map((cat, cIdx) => (
              <div key={cIdx} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFC8] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A84B2C]">
                  {cat.category}
                </h4>
                <ul className="space-y-1 text-xs">
                  {cat.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-center justify-between py-1 border-b border-[#EFE8DD] last:border-0">
                      <span className="font-medium text-[#2D241E]">{item.name}</span>
                      <span className="font-bold text-[#7A5A40] bg-[#EAE2D5] px-2 py-0.5 rounded">
                        {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Selected Day's Menu Card */
        <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden space-y-5 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFC8] pb-4">
            <div>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A84B2C]/10 text-[#A84B2C] mb-1">
                {currentDayPlan.dayName.toUpperCase()} PLAN
              </div>
              <h3 className="text-xl font-bold font-display text-[#2D241E]">
                {dayMenu.title}
              </h3>
              <p className="text-xs text-[#7A6A5D]">
                {dayMenu.theme}
              </p>
            </div>

            <button
              onClick={() => onSelectDayAsToday(dayMenu)}
              className="self-start sm:self-auto flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2A5A3B] hover:bg-[#1E432B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <span>Make Today's Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Meal breakdown for the day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Breakfast */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-2">
              <div className="flex items-center space-x-2 text-amber-700">
                <Sun className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Breakfast</span>
              </div>
              <h4 className="font-bold text-sm text-[#2D241E]">{dayMenu.breakfast.title}</h4>
              <div className="space-y-1">
                {dayMenu.breakfast.dishes.map((dish) => (
                  <button
                    key={dish.id || dish.name}
                    onClick={() => onSelectDish(dish)}
                    className="w-full text-left flex items-center justify-between py-1 text-xs text-[#5A4B3E] hover:text-[#A84B2C]"
                  >
                    <span>• {dish.name}</span>
                    <span className="text-[10px] text-[#A84B2C] underline">Recipe</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-2">
              <div className="flex items-center space-x-2 text-orange-600">
                <Sun className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Lunch</span>
              </div>
              <h4 className="font-bold text-sm text-[#2D241E]">{dayMenu.lunch.title}</h4>
              <div className="space-y-1">
                {dayMenu.lunch.dishes.map((dish) => (
                  <button
                    key={dish.id || dish.name}
                    onClick={() => onSelectDish(dish)}
                    className="w-full text-left flex items-center justify-between py-1 text-xs text-[#5A4B3E] hover:text-[#A84B2C]"
                  >
                    <span>• {dish.name}</span>
                    <span className="text-[10px] text-[#A84B2C] underline">Recipe</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Snack */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-2">
              <div className="flex items-center space-x-2 text-amber-800">
                <Coffee className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Tea Snack</span>
              </div>
              <h4 className="font-bold text-sm text-[#2D241E]">{dayMenu.snack.title}</h4>
              <div className="space-y-1">
                {dayMenu.snack.dishes.map((dish) => (
                  <button
                    key={dish.id || dish.name}
                    onClick={() => onSelectDish(dish)}
                    className="w-full text-left flex items-center justify-between py-1 text-xs text-[#5A4B3E] hover:text-[#A84B2C]"
                  >
                    <span>• {dish.name}</span>
                    <span className="text-[10px] text-[#A84B2C] underline">Recipe</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-2">
              <div className="flex items-center space-x-2 text-indigo-700">
                <Moon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Dinner</span>
              </div>
              <h4 className="font-bold text-sm text-[#2D241E]">{dayMenu.dinner.title}</h4>
              <div className="space-y-1">
                {dayMenu.dinner.dishes.map((dish) => (
                  <button
                    key={dish.id || dish.name}
                    onClick={() => onSelectDish(dish)}
                    className="w-full text-left flex items-center justify-between py-1 text-xs text-[#5A4B3E] hover:text-[#A84B2C]"
                  >
                    <span>• {dish.name}</span>
                    <span className="text-[10px] text-[#A84B2C] underline">Recipe</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

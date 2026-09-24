import React, { useState } from 'react';
import { X, BookOpen, Clock, Users, ChefHat, Sparkles, Check } from 'lucide-react';
import { DailyMenu, Dish } from '../types/meal';
import { scaleRecipeIngredients } from '../services/southIndianDatabase';

interface AllRecipesModalProps {
  menu: DailyMenu;
  onClose: () => void;
}

export const AllRecipesModal: React.FC<AllRecipesModalProps> = ({
  menu,
  onClose,
}) => {
  const [servings, setServings] = useState<number>(menu.servings || 4);
  const [activeFilter, setActiveFilter] = useState<'all' | 'breakfast' | 'lunch' | 'snack' | 'dinner'>('all');

  const allDishes: { dish: Dish; meal: string }[] = [
    ...menu.breakfast.dishes.map(d => ({ dish: d, meal: 'Breakfast' })),
    ...menu.lunch.dishes.map(d => ({ dish: d, meal: 'Lunch' })),
    ...menu.snack.dishes.map(d => ({ dish: d, meal: 'Snack' })),
    ...menu.dinner.dishes.map(d => ({ dish: d, meal: 'Dinner' })),
  ];

  const filteredDishes = activeFilter === 'all' 
    ? allDishes 
    : allDishes.filter(item => item.meal.toLowerCase() === activeFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] flex flex-col overflow-hidden text-[#2D241E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1C442A] to-[#2A5A3B] text-white p-5 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Complete Recipe Book</span>
          </div>

          <h2 className="text-2xl font-bold font-display text-amber-50">
            Today's Recipes ({allDishes.length} Dishes)
          </h2>
          <p className="text-white/80 text-xs mt-1">
            Step-by-step cooking guide scaled automatically for {servings} people
          </p>
        </div>

        {/* Scalable servings and meal filter */}
        <div className="bg-[#F3ECE2] px-5 py-3 border-b border-[#E2D5C3] flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {(['all', 'breakfast', 'lunch', 'snack', 'dinner'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-[#A84B2C] text-white shadow-2xs'
                    : 'bg-white text-[#5A4B3E] border border-[#E2D5C3]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <span className="font-semibold text-[#5A4B3E] mr-1">Portions:</span>
            {[2, 4, 6, 8].map((s) => (
              <button
                key={s}
                onClick={() => setServings(s)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  servings === s
                    ? 'bg-[#2A5A3B] text-white'
                    : 'bg-white text-[#5A4B3E] border border-[#E2D5C3]'
                }`}
              >
                {s}p
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable recipe cards */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          {filteredDishes.map(({ dish, meal }, idx) => {
            const scaled = scaleRecipeIngredients(dish.ingredients || [], dish.servings || 4, servings);

            return (
              <div 
                key={idx}
                className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-4"
              >
                <div className="flex items-start justify-between border-b border-[#F0E8DC] pb-3">
                  <div>
                    <div className="flex items-center space-x-2 text-xs mb-1">
                      <span className="px-2 py-0.5 rounded font-bold bg-[#A84B2C]/10 text-[#A84B2C]">
                        {meal}
                      </span>
                      <span className="text-[#7A6A5D]">•</span>
                      <span className="font-semibold text-[#7A6A5D]">{dish.category}</span>
                    </div>
                    <h3 className="text-lg font-bold font-display text-[#2D241E]">
                      {dish.name}
                    </h3>
                    {dish.tamilName && (
                      <span className="text-xs text-[#7A6A5D] block">{dish.tamilName}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-[#7A6A5D]">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-[#A84B2C]" />
                      <span>{dish.cookTime}</span>
                    </div>
                  </div>
                </div>

                {/* Scaled ingredients */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2">
                    Ingredients ({servings} servings)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {scaled.map((ing, iIdx) => (
                      <div key={iIdx} className="flex items-center justify-between p-1.5 rounded bg-[#FAF7F2]">
                        <span className="text-[#3D3028]">{ing.name}</span>
                        <span className="font-bold text-[#A84B2C] ml-2">{ing.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2">
                    Cooking Steps
                  </h4>
                  <ol className="space-y-1.5 text-xs text-[#3D3028]">
                    {dish.steps?.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start">
                        <span className="w-4 h-4 rounded-full bg-[#EAE2D5] text-[#7A5A40] text-[10px] font-bold flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                {dish.tips && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 flex items-start">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span><strong>Secret Tip:</strong> {dish.tips}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F3ECE2] border-t border-[#E2D5C3] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2D241E] hover:bg-[#40332B] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Recipes
          </button>
        </div>
      </div>
    </div>
  );
};

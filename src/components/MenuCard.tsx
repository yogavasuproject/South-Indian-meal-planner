import React, { useState } from 'react';
import { 
  Sun, Sunset, Moon, Coffee, Clock, Users, IndianRupee, 
  Recycle, ChevronRight, RefreshCw, ChefHat, Sparkles, 
  Flame, CheckCircle, Calendar, Heart, Share2
} from 'lucide-react';
import { DailyMenu, MealSlot, Dish } from '../types/meal';

interface MenuCardProps {
  menu: DailyMenu;
  onSelectDish: (dish: Dish) => void;
  onSwapSlot: (slot: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
  isSwappingSlot: string | null;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  onSelectDish,
  onSwapSlot,
  isSwappingSlot,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'workflow' | 'reuse'>('menu');

  const renderSlotHeader = (
    icon: React.ReactNode, 
    label: string, 
    time: string, 
    slotKey: 'breakfast' | 'lunch' | 'snack' | 'dinner',
    slot: MealSlot
  ) => (
    <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC8]/70">
      <div className="flex items-center space-x-2">
        <div className="p-1.5 rounded-lg bg-[#F3ECE2] text-[#A84B2C]">
          {icon}
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A796C]">
            {time}
          </span>
          <h3 className="text-base font-bold text-[#2D241E] font-display leading-tight">
            {label}
          </h3>
        </div>
      </div>

      <button
        onClick={() => onSwapSlot(slotKey)}
        disabled={isSwappingSlot === slotKey}
        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#8A4A28] hover:bg-[#F3ECE2] transition-colors border border-transparent hover:border-[#E2D5C3] disabled:opacity-50 cursor-pointer"
        title={`Change only ${label}`}
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSwappingSlot === slotKey ? 'animate-spin' : ''}`} />
        <span className="hidden xs:inline">Change {label}</span>
      </button>
    </div>
  );

  return (
    <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFC8] shadow-lg overflow-hidden">
      {/* Top Banner */}
      <div className="banana-leaf-bg text-white p-5 sm:p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 text-emerald-100 backdrop-blur-xs">
              🍽️ TODAY'S SOUTH INDIAN MENU
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-amber-50 tracking-tight">
              {menu.title}
            </h2>
            {menu.theme && (
              <p className="text-emerald-100/90 text-xs sm:text-sm font-medium">
                {menu.theme}
              </p>
            )}
          </div>

          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`p-2.5 rounded-2xl backdrop-blur-md transition-transform active:scale-90 ${
                isFavorite 
                  ? 'bg-rose-500 text-white shadow-md' 
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              aria-label="Save to favorites"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* 4 Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/15 text-xs text-white/95">
          <div className="bg-black/15 rounded-xl px-3 py-2 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-white/70 block">Cooking Time</span>
              <span className="font-bold">{menu.totalCookingTime || '1 hr 15 mins'}</span>
            </div>
          </div>

          <div className="bg-black/15 rounded-xl px-3 py-2 flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-white/70 block">Portion</span>
              <span className="font-bold">Serves {menu.servings}</span>
            </div>
          </div>

          <div className="bg-black/15 rounded-xl px-3 py-2 flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-white/70 block">Est. Cost</span>
              <span className="font-bold">{menu.estimatedCost || '₹180 - ₹240'}</span>
            </div>
          </div>

          <div className="bg-black/15 rounded-xl px-3 py-2 flex items-center space-x-2">
            <Recycle className="w-4 h-4 text-teal-300 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-white/70 block">Smart Reuse</span>
              <span className="font-bold">{menu.ingredientReuse?.length || 2} Ingredients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs: Menu View | Cooking Workflow | Smart Ingredient Reuse */}
      <div className="flex border-b border-[#E8DFC8] bg-[#F3ECE2]/80 px-4 pt-2">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'menu'
              ? 'border-[#A84B2C] text-[#A84B2C] bg-[#FAF7F2] rounded-t-xl'
              : 'border-transparent text-[#7A6A5D] hover:text-[#2D241E]'
          }`}
        >
          <span>🍽️ Today's Meals</span>
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'workflow'
              ? 'border-[#A84B2C] text-[#A84B2C] bg-[#FAF7F2] rounded-t-xl'
              : 'border-transparent text-[#7A6A5D] hover:text-[#2D241E]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Cooking Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('reuse')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'reuse'
              ? 'border-[#A84B2C] text-[#A84B2C] bg-[#FAF7F2] rounded-t-xl'
              : 'border-transparent text-[#7A6A5D] hover:text-[#2D241E]'
          }`}
        >
          <Recycle className="w-3.5 h-3.5" />
          <span>Smart Reuse</span>
        </button>
      </div>

      {/* Tab 1: Menu View */}
      {activeTab === 'menu' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Breakfast */}
          <div className="space-y-3 bg-white/70 p-4 rounded-2xl border border-[#EBE2D5] shadow-xs">
            {renderSlotHeader(
              <Sun className="w-4 h-4 text-amber-500" />,
              'Breakfast',
              '🌅 Morning Tiffin',
              'breakfast',
              menu.breakfast
            )}
            
            <p className="text-xs text-[#7A6A5D] font-medium">
              {menu.breakfast.title}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {menu.breakfast.dishes.map((dish) => (
                <button
                  key={dish.id || dish.name}
                  onClick={() => onSelectDish(dish)}
                  className="text-left p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EDE1] border border-[#E8DFC8] hover:border-[#A84B2C]/50 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                >
                  <div className="space-y-0.5 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A84B2C] bg-[#A84B2C]/10 px-1.5 py-0.5 rounded">
                      {dish.category}
                    </span>
                    <h4 className="font-bold text-sm text-[#2D241E] group-hover:text-[#A84B2C] transition-colors leading-snug">
                      {dish.name}
                    </h4>
                    {dish.tamilName && (
                      <span className="text-[11px] text-[#7A6A5D] block">
                        {dish.tamilName}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A84B2C]/60 group-hover:text-[#A84B2C] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Lunch */}
          <div className="space-y-3 bg-white/70 p-4 rounded-2xl border border-[#EBE2D5] shadow-xs">
            {renderSlotHeader(
              <Sun className="w-4 h-4 text-orange-500" />,
              'Lunch',
              '☀️ Afternoon Virundhu',
              'lunch',
              menu.lunch
            )}

            <p className="text-xs text-[#7A6A5D] font-medium">
              {menu.lunch.title}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {menu.lunch.dishes.map((dish) => (
                <button
                  key={dish.id || dish.name}
                  onClick={() => onSelectDish(dish)}
                  className="text-left p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EDE1] border border-[#E8DFC8] hover:border-[#A84B2C]/50 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                >
                  <div className="space-y-0.5 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A5A3B] bg-[#2A5A3B]/10 px-1.5 py-0.5 rounded">
                      {dish.category}
                    </span>
                    <h4 className="font-bold text-sm text-[#2D241E] group-hover:text-[#A84B2C] transition-colors leading-snug">
                      {dish.name}
                    </h4>
                    {dish.tamilName && (
                      <span className="text-[11px] text-[#7A6A5D] block">
                        {dish.tamilName}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A84B2C]/60 group-hover:text-[#A84B2C] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Evening Snack */}
          <div className="space-y-3 bg-white/70 p-4 rounded-2xl border border-[#EBE2D5] shadow-xs">
            {renderSlotHeader(
              <Coffee className="w-4 h-4 text-amber-700" />,
              'Snack & Tea',
              '☕ 4:30 PM Tea-Time',
              'snack',
              menu.snack
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {menu.snack.dishes.map((dish) => (
                <button
                  key={dish.id || dish.name}
                  onClick={() => onSelectDish(dish)}
                  className="text-left p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EDE1] border border-[#E8DFC8] hover:border-[#A84B2C]/50 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                >
                  <div className="space-y-0.5 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      {dish.category}
                    </span>
                    <h4 className="font-bold text-sm text-[#2D241E] group-hover:text-[#A84B2C] transition-colors leading-snug">
                      {dish.name}
                    </h4>
                    {dish.tamilName && (
                      <span className="text-[11px] text-[#7A6A5D] block">
                        {dish.tamilName}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A84B2C]/60 group-hover:text-[#A84B2C] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Dinner */}
          <div className="space-y-3 bg-white/70 p-4 rounded-2xl border border-[#EBE2D5] shadow-xs">
            {renderSlotHeader(
              <Moon className="w-4 h-4 text-indigo-600" />,
              'Dinner',
              '🌙 Light Night Tiffin',
              'dinner',
              menu.dinner
            )}

            <p className="text-xs text-[#7A6A5D] font-medium">
              {menu.dinner.title}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {menu.dinner.dishes.map((dish) => (
                <button
                  key={dish.id || dish.name}
                  onClick={() => onSelectDish(dish)}
                  className="text-left p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EDE1] border border-[#E8DFC8] hover:border-[#A84B2C]/50 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                >
                  <div className="space-y-0.5 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {dish.category}
                    </span>
                    <h4 className="font-bold text-sm text-[#2D241E] group-hover:text-[#A84B2C] transition-colors leading-snug">
                      {dish.name}
                    </h4>
                    {dish.tamilName && (
                      <span className="text-[11px] text-[#7A6A5D] block">
                        {dish.tamilName}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A84B2C]/60 group-hover:text-[#A84B2C] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cooking Workflow (Schedule) */}
      {activeTab === 'workflow' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Efficient Multi-Pot Sequence: </span>
              Cook synchronized batches to prepare hot meals under {menu.totalCookingTime} with minimal fuel and vessel washing.
            </div>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E2D5C3]">
            {menu.preparationPlan?.map((plan, idx) => (
              <div key={idx} className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#A84B2C] text-white flex items-center justify-center text-xs font-bold shadow-xs z-10">
                  {idx + 1}
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] flex-1 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A84B2C]">{plan.time}</span>
                    <span className="text-xs font-semibold text-[#7A6A5D] uppercase tracking-wider">{plan.phase}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#3D3028]">
                    {plan.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2A5A3B] mr-2 mt-1.5 flex-shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Smart Ingredient Reuse */}
      {activeTab === 'reuse' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start space-x-2">
            <Recycle className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Zero-Waste Kitchen Strategy: </span>
              Common prep tasks shared across breakfast, lunch and dinner reduce grocery spend and kitchen cleanup.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menu.ingredientReuse?.map((reuse, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#2D241E] flex items-center">
                    <span className="w-2 h-2 rounded-full bg-teal-600 mr-2" />
                    {reuse.ingredient}
                  </h4>
                  <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                    Used in {reuse.usedIn.length} dishes
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {reuse.usedIn.map((dishName, dIdx) => (
                    <span key={dIdx} className="text-[11px] bg-[#F3ECE2] text-[#5A4B3E] px-2 py-0.5 rounded-md font-medium">
                      {dishName}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-[#5A4B3E] leading-relaxed pt-1 border-t border-[#F0E8DC]">
                  💡 {reuse.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

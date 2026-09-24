import React from 'react';
import { Clock, Flame, Coins, Globe2, Leaf, Egg, Drumstick, Sparkles } from 'lucide-react';
import { UserPreferences, DietType, SpiceLevel, CuisineStyle, CookingTimeOption } from '../types/meal';

interface PreferenceChipsProps {
  preferences: UserPreferences;
  onChangePreferences: (newPrefs: UserPreferences) => void;
  onOpenPreferences: () => void;
}

export const PreferenceChips: React.FC<PreferenceChipsProps> = ({
  preferences,
  onChangePreferences,
  onOpenPreferences,
}) => {
  const updateDiet = (diet: DietType) => {
    onChangePreferences({ ...preferences, dietType: diet });
  };

  const cycleSpice = () => {
    const sequence: SpiceLevel[] = ['mild', 'medium', 'spicy'];
    const next = sequence[(sequence.indexOf(preferences.spice) + 1) % sequence.length];
    onChangePreferences({ ...preferences, spice: next });
  };

  const cycleTime = () => {
    const sequence: CookingTimeOption[] = ['under-30', '30-60', 'flexible'];
    const next = sequence[(sequence.indexOf(preferences.cookingTime) + 1) % sequence.length];
    onChangePreferences({ ...preferences, cookingTime: next });
  };

  const cycleCuisine = () => {
    const sequence: CuisineStyle[] = ['tamil', 'kerala', 'karnataka', 'andhra', 'mixed'];
    const next = sequence[(sequence.indexOf(preferences.cuisine) + 1) % sequence.length];
    onChangePreferences({ ...preferences, cuisine: next });
  };

  const getDietIcon = () => {
    switch (preferences.dietType) {
      case 'veg':
        return <Leaf className="w-3.5 h-3.5 text-emerald-600 mr-1" />;
      case 'egg':
        return <Egg className="w-3.5 h-3.5 text-amber-600 mr-1" />;
      case 'non-veg':
        return <Drumstick className="w-3.5 h-3.5 text-rose-600 mr-1" />;
      default:
        return <Leaf className="w-3.5 h-3.5 text-emerald-600 mr-1" />;
    }
  };

  const getTimeLabel = () => {
    switch (preferences.cookingTime) {
      case 'under-30':
        return '< 30 mins (Quick)';
      case '30-60':
        return '30–60 mins';
      case '60-90':
        return '60–90 mins';
      default:
        return 'Flexible time';
    }
  };

  const getCuisineLabel = () => {
    switch (preferences.cuisine) {
      case 'tamil':
        return 'Tamil Home Cooking';
      case 'kerala':
        return 'Kerala Style';
      case 'karnataka':
        return 'Karnataka Style';
      case 'andhra':
        return 'Andhra & Telangana';
      default:
        return 'South Indian Blend';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[#7A6A5D] px-1 font-medium">
        <span>Cooking settings</span>
        <button
          onClick={onOpenPreferences}
          className="text-[#A84B2C] hover:underline font-semibold flex items-center gap-1"
        >
          <span>More options</span>
          {preferences.availableIngredients.length > 0 && (
            <span className="bg-[#A84B2C]/15 text-[#A84B2C] text-[10px] px-1.5 py-0.2 rounded-full">
              {preferences.availableIngredients.length} ingredients in pantry
            </span>
          )}
        </button>
      </div>

      {/* Horizontal scrollable chips bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {/* Diet Toggle */}
        <button
          onClick={() => {
            const nextDiet: DietType =
              preferences.dietType === 'veg'
                ? 'egg'
                : preferences.dietType === 'egg'
                ? 'non-veg'
                : 'veg';
            updateDiet(nextDiet);
          }}
          className="flex-shrink-0 flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E2D5C3] shadow-2xs hover:border-[#A84B2C]/40 transition-all text-[#3D3028]"
        >
          {getDietIcon()}
          <span className="capitalize">{preferences.dietType}</span>
        </button>

        {/* Cuisine Toggle */}
        <button
          onClick={cycleCuisine}
          className="flex-shrink-0 flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E2D5C3] shadow-2xs hover:border-[#A84B2C]/40 transition-all text-[#3D3028]"
        >
          <Globe2 className="w-3.5 h-3.5 text-[#A84B2C] mr-1.5" />
          <span>{getCuisineLabel()}</span>
        </button>

        {/* Cooking Time Toggle */}
        <button
          onClick={cycleTime}
          className="flex-shrink-0 flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E2D5C3] shadow-2xs hover:border-[#A84B2C]/40 transition-all text-[#3D3028]"
        >
          <Clock className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
          <span>{getTimeLabel()}</span>
        </button>

        {/* Spice Level Toggle */}
        <button
          onClick={cycleSpice}
          className="flex-shrink-0 flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E2D5C3] shadow-2xs hover:border-[#A84B2C]/40 transition-all text-[#3D3028]"
        >
          <Flame className="w-3.5 h-3.5 text-red-600 mr-1.5" />
          <span className="capitalize">{preferences.spice} Spice</span>
        </button>

        {/* Budget Toggle */}
        <button
          onClick={() => {
            const nextBudget = preferences.budget === 'economy' ? 'regular' : preferences.budget === 'regular' ? 'flexible' : 'economy';
            onChangePreferences({ ...preferences, budget: nextBudget });
          }}
          className="flex-shrink-0 flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E2D5C3] shadow-2xs hover:border-[#A84B2C]/40 transition-all text-[#3D3028]"
        >
          <Coins className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
          <span className="capitalize">{preferences.budget}</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, Check, Save, Sliders, Users, Utensils, 
  Flame, Clock, Coins, ShieldAlert, Plus, Trash2, Heart 
} from 'lucide-react';
import { UserPreferences, DietType, CuisineStyle, SpiceLevel, CookingTimeOption, BudgetOption } from '../types/meal';
import { DIETARY_OPTIONS, COMMON_AVOID_INGREDIENTS } from '../services/southIndianDatabase';

interface PreferencesModalProps {
  preferences: UserPreferences;
  onSavePreferences: (updated: UserPreferences) => void;
  onClose: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  preferences,
  onSavePreferences,
  onClose,
}) => {
  const [formData, setFormData] = useState<UserPreferences>({ ...preferences });
  const [avoidInput, setAvoidInput] = useState('');
  const [customDietaryInput, setCustomDietaryInput] = useState('');

  const handleToggleDietary = (restriction: string) => {
    const list = formData.dietaryRestrictions || [];
    if (list.includes(restriction)) {
      setFormData({ ...formData, dietaryRestrictions: list.filter(r => r !== restriction) });
    } else {
      setFormData({ ...formData, dietaryRestrictions: [...list, restriction] });
    }
  };

  const handleToggleAvoid = (ingredient: string) => {
    const list = formData.avoidIngredients || [];
    if (list.includes(ingredient)) {
      setFormData({ ...formData, avoidIngredients: list.filter(i => i !== ingredient) });
    } else {
      setFormData({ ...formData, avoidIngredients: [...list, ingredient] });
    }
  };

  const handleAddCustomAvoid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avoidInput.trim()) return;
    const item = avoidInput.trim();
    if (!formData.avoidIngredients.includes(item)) {
      setFormData({ ...formData, avoidIngredients: [...formData.avoidIngredients, item] });
    }
    setAvoidInput('');
  };

  const handleSave = () => {
    onSavePreferences(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] flex flex-col overflow-hidden text-[#2D241E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2D241E] to-[#4A3B2E] text-white p-5 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Household Kitchen Setup</span>
          </div>

          <h2 className="text-2xl font-bold font-display text-amber-50">
            Cooking Preferences
          </h2>
          <p className="text-white/80 text-xs mt-1">
            Tailor daily meal generation to your household size, health needs, and spice taste
          </p>
        </div>

        {/* Scrollable body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Household Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2 flex items-center">
              <Users className="w-3.5 h-3.5 mr-1.5 text-[#A84B2C]" />
              Household Size (Servings)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, servings: num })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.servings === num
                      ? 'bg-[#A84B2C] text-white border-[#A84B2C] shadow-xs'
                      : 'bg-white text-[#5A4B3E] border-[#E2D5C3] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {num} {num === 1 ? 'Person' : 'People'}
                </button>
              ))}
            </div>
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2 flex items-center">
              <Utensils className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
              Food Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'veg', label: 'Vegetarian' },
                { id: 'egg', label: 'Eggiterian' },
                { id: 'non-veg', label: 'Non-Veg' },
                { id: 'mixed', label: 'Mixed' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, dietType: item.id as DietType })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.dietType === item.id
                      ? 'bg-[#2A5A3B] text-white border-[#2A5A3B] shadow-xs'
                      : 'bg-white text-[#5A4B3E] border-[#E2D5C3] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Regional Cuisine Style */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2">
              Preferred South Indian Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'tamil', label: 'Tamil Nadu (Home)' },
                { id: 'kerala', label: 'Kerala' },
                { id: 'karnataka', label: 'Karnataka' },
                { id: 'andhra', label: 'Andhra & Telangana' },
                { id: 'mixed', label: 'Mixed South Indian' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, cuisine: item.id as CuisineStyle })}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer ${
                    formData.cuisine === item.id
                      ? 'bg-[#A84B2C] text-white border-[#A84B2C] shadow-xs'
                      : 'bg-white text-[#5A4B3E] border-[#E2D5C3] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level & Cooking Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2 flex items-center">
                <Flame className="w-3.5 h-3.5 mr-1 text-red-600" />
                Spice Level
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['mild', 'medium', 'spicy'] as SpiceLevel[]).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setFormData({ ...formData, spice: sp })}
                    className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                      formData.spice === sp
                        ? 'bg-red-700 text-white border-red-700 shadow-xs'
                        : 'bg-white text-[#5A4B3E] border-[#E2D5C3]'
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-amber-700" />
                Cooking Time
              </label>
              <select
                value={formData.cookingTime}
                onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value as CookingTimeOption })}
                className="w-full bg-white border border-[#E2D5C3] rounded-xl px-3 py-2 text-xs font-bold text-[#2D241E] focus:outline-none focus:border-[#A84B2C]"
              >
                <option value="under-30">Under 30 mins (Express)</option>
                <option value="30-60">30–60 mins (Standard)</option>
                <option value="60-90">60–90 mins (Elaborate)</option>
                <option value="flexible">No restriction (Flexible)</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2 flex items-center">
              <Coins className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Budget
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'economy', label: 'Economy' },
                { id: 'regular', label: 'Regular' },
                { id: 'flexible', label: 'Flexible' }
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, budget: b.id as BudgetOption })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.budget === b.id
                      ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                      : 'bg-white text-[#5A4B3E] border-[#E2D5C3]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2 flex items-center">
              <Heart className="w-3.5 h-3.5 mr-1 text-rose-600" />
              Dietary Restrictions & Health Focus
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((item) => {
                const isChecked = formData.dietaryRestrictions.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleDietary(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isChecked
                        ? 'bg-[#2A5A3B] text-white shadow-xs'
                        : 'bg-white text-[#5A4B3E] border border-[#E2D5C3] hover:border-[#2A5A3B]'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredients to Avoid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2 flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" />
              Ingredients to Avoid / Disliked
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_AVOID_INGREDIENTS.map((ing) => {
                const isAvoided = formData.avoidIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => handleToggleAvoid(ing)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isAvoided
                        ? 'bg-rose-100 text-rose-800 border border-rose-300 line-through'
                        : 'bg-white text-[#5A4B3E] border border-[#E2D5C3] hover:border-rose-300'
                    }`}
                  >
                    {ing}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAddCustomAvoid} className="flex gap-2">
              <input
                type="text"
                value={avoidInput}
                onChange={(e) => setAvoidInput(e.target.value)}
                placeholder="Add another ingredient to avoid..."
                className="flex-1 bg-white border border-[#E2D5C3] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 transition-colors"
              >
                Avoid
              </button>
            </form>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-[#F3ECE2] border-t border-[#E2D5C3] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#7A6A5D] hover:text-[#2D241E]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-[#A84B2C] hover:bg-[#8F3C20] text-white text-xs font-bold transition-all shadow-md shadow-[#A84B2C]/25 flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Check, Refrigerator, Sparkles, Plus, Trash2 } from 'lucide-react';
import { POPULAR_AVAILABLE_INGREDIENTS } from '../services/southIndianDatabase';

interface UseIngredientsModalProps {
  currentIngredients: string[];
  onApplyAndGenerate: (selectedIngredients: string[]) => void;
  onClose: () => void;
  isLoading: boolean;
}

export const UseIngredientsModal: React.FC<UseIngredientsModalProps> = ({
  currentIngredients,
  onApplyAndGenerate,
  onClose,
  isLoading,
}) => {
  const [selected, setSelected] = useState<string[]>(currentIngredients || []);
  const [customInput, setCustomInput] = useState('');

  const toggleIngredient = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter(i => i !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const item = customInput.trim();
    if (!selected.includes(item)) {
      setSelected([...selected, item]);
    }
    setCustomInput('');
  };

  const handleGenerate = () => {
    onApplyAndGenerate(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] flex flex-col overflow-hidden text-[#2D241E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2A5A3B] to-[#3B724F] text-white p-5 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Refrigerator className="w-4 h-4" />
            <span>Pantry & Fridge Assistant</span>
          </div>

          <h2 className="text-2xl font-bold font-display text-amber-50">
            Use My Ingredients
          </h2>
          <p className="text-white/80 text-xs mt-1">
            Select what you have at home. AI will create balanced South Indian meals that reuse them without waste.
          </p>
        </div>

        {/* Selected count info banner */}
        <div className="bg-[#F3ECE2] px-5 py-2.5 border-b border-[#E2D5C3] flex items-center justify-between text-xs">
          <span className="font-semibold text-[#5A4B3E]">
            {selected.length} items selected
          </span>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-[#A84B2C] hover:underline font-bold"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Ingredients Grid */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick select popular kitchen staples */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6A5D] mb-2.5">
              Common South Indian Pantry & Fridge Staples
            </h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_AVAILABLE_INGREDIENTS.map((item) => {
                const isSelected = selected.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleIngredient(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2A5A3B] text-white shadow-xs scale-102'
                        : 'bg-white text-[#4A3B2E] border border-[#E2D5C3] hover:border-[#2A5A3B]/50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add custom ingredient */}
          <form onSubmit={handleAddCustom} className="pt-2 border-t border-[#E8DFC8] space-y-2">
            <span className="text-xs font-bold text-[#7A6A5D] block">
              Have something else? (e.g. Chow chow, Bitter gourd, Ridge gourd, Cauliflower)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type ingredient..."
                className="flex-1 bg-white border border-[#E2D5C3] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:border-[#2A5A3B]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2A5A3B] text-white text-xs font-bold hover:bg-[#1E432B] transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Smart Reuse Preview Hint */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-950 space-y-1">
            <div className="font-bold flex items-center text-amber-900">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Example of how AI will optimize:
            </div>
            <p className="text-[#5A4B3E]">
              If you have <strong>carrots + beans + coconut + potatoes</strong>: AI will pair carrot-beans poriyal for lunch, coconut for morning chutney, and crispy roasted potatoes for dinner!
            </p>
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
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-2xl bg-[#A84B2C] hover:bg-[#8F3C20] text-white text-xs font-bold transition-all shadow-md shadow-[#A84B2C]/25 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Menu Using These</span>
          </button>
        </div>
      </div>
    </div>
  );
};

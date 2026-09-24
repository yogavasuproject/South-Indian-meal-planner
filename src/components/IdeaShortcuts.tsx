import React from 'react';
import { Zap, Sparkles, PiggyBank, Clock, Refrigerator } from 'lucide-react';

interface IdeaShortcutsProps {
  onSelectShortcut: (type: string, promptText?: string) => void;
  onOpenIngredientsModal: () => void;
  isLoading: boolean;
}

export const IdeaShortcuts: React.FC<IdeaShortcutsProps> = ({
  onSelectShortcut,
  onOpenIngredientsModal,
  isLoading,
}) => {
  const shortcuts = [
    {
      id: 'quick',
      label: 'Quick Meal',
      icon: <Zap className="w-3.5 h-3.5 text-amber-600" />,
      action: () => onSelectShortcut('quick', 'Generate a super quick, fuss-free meal plan with minimal chopping and prep'),
    },
    {
      id: 'traditional',
      label: 'Traditional Tamil',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#A84B2C]" />,
      action: () => onSelectShortcut('traditional', 'Authentic Tamil Brahmin / village style meal with classic sambar or vatha kuzhambu, rasam, and poriyal'),
    },
    {
      id: 'budget',
      label: 'Budget Meal',
      icon: <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />,
      action: () => onSelectShortcut('budget', 'Low-cost economic household cooking maximizing lentils, seasonal local veggies and zero waste'),
    },
    {
      id: '30min',
      label: '30-Minute Meal',
      icon: <Clock className="w-3.5 h-3.5 text-sky-600" />,
      action: () => onSelectShortcut('30min', 'Ultra fast under-30-minute cooking: one-pot rice, paruppu thogayal, or quick tiffin'),
    },
    {
      id: 'ingredients',
      label: 'Use My Ingredients',
      icon: <Refrigerator className="w-3.5 h-3.5 text-purple-600" />,
      action: onOpenIngredientsModal,
    },
  ];

  return (
    <div className="pt-2 pb-1">
      <div className="flex items-center space-x-1.5 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6A5D]">
          Running out of ideas?
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {shortcuts.map((shortcut) => (
          <button
            key={shortcut.id}
            onClick={shortcut.action}
            disabled={isLoading}
            className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F3ECE2] hover:bg-[#EBE2D5] text-[#4A3B2E] border border-[#E2D5C3]/80 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {shortcut.icon}
            <span className="whitespace-nowrap">{shortcut.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

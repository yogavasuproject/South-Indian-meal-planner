import React from 'react';
import { Home, Calendar, ShoppingBag, Heart, SlidersHorizontal, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'weekly' | 'ai' | 'shopping' | 'saved' | 'preferences';

interface BottomNavBarProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  shoppingCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  shoppingCount = 0,
}) => {
  interface TabItem {
    id: NavTab;
    label: string;
    icon: typeof Home;
    badge?: number;
    highlight?: boolean;
  }

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'weekly', label: 'Weekly', icon: Calendar },
    { id: 'ai', label: 'AI Suite', icon: Sparkles, highlight: true },
    { id: 'shopping', label: 'Groceries', icon: ShoppingBag, badge: shoppingCount > 0 ? shoppingCount : undefined },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'preferences', label: 'Settings', icon: SlidersHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DFC8] px-2 py-1.5 pb-safe transition-all shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isHighlight = tab.highlight;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#A84B2C] font-bold scale-105'
                  : isHighlight
                    ? 'text-amber-700 hover:text-amber-900 font-semibold'
                    : 'text-[#8A796C] hover:text-[#2D241E] font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'} ${isHighlight && !isActive ? 'text-amber-600' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#A84B2C] text-white text-[9px] font-bold px-1 rounded-full min-w-3.5 text-center">
                    {tab.badge}
                  </span>
                )}
                {isHighlight && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-[#A84B2C] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

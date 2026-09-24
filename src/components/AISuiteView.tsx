import React from 'react';
import { 
  Sparkles, MessageSquare, Image as ImageIcon, Mic, 
  Film, ChefHat, Flame, ArrowRight, Bot, Zap, Play, CheckCircle2 
} from 'lucide-react';
import { DailyMenu } from '../types/meal';

interface AISuiteViewProps {
  currentMenu: DailyMenu;
  onOpenChat: (initialPrompt?: string) => void;
  onOpenImageStudio: () => void;
  onOpenLiveVoice: () => void;
  onOpenVeoVideo: (initialImage?: string, prompt?: string) => void;
  onSelectDish: (dish: any) => void;
}

export const AISuiteView: React.FC<AISuiteViewProps> = ({
  currentMenu,
  onOpenChat,
  onOpenImageStudio,
  onOpenLiveVoice,
  onOpenVeoVideo,
  onSelectDish,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#2D1B36] via-[#4A2D48] to-[#1C3626] text-white p-6 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Next-Gen Gemini AI Culinary Studio</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Smart Kitchen AI Superpowers
          </h2>

          <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
            Multi-turn culinary chat, real-time hands-free voice coaching, photo styling & editing, and cinematic Veo video animations — custom-tailored for South Indian everyday cooking.
          </p>
        </div>

        {/* Current Context Pill */}
        <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-white/90">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-4 h-4 text-amber-300" />
            <span>Active Menu: <strong>{currentMenu.title}</strong></span>
          </div>
          <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-300">
            {currentMenu.servings} Servings • {currentMenu.dietType}
          </span>
        </div>
      </div>

      {/* Grid of the 4 Main AI Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Multi-Turn Gemini Chatbot */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-xs hover:border-[#A84B2C]/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 text-2xl">
                👵
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Multi-Turn Chat
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#2D241E] font-display">
                Paati & Chef AI Chatbot
              </h3>
              <p className="text-xs text-[#7A6A5D] mt-1 leading-relaxed">
                Multi-turn conversation with memory. Switch between traditional Paati, Master Chef Sundaram, or Express 15-min coach.
              </p>
            </div>

            {/* Model capabilities badges */}
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span className="bg-[#FAF7F2] text-[#5A4B3E] px-2 py-0.5 rounded-md border border-[#E8DFC8] font-mono">
                gemini-3.5-flash
              </span>
              <span className="bg-[#FAF7F2] text-purple-900 px-2 py-0.5 rounded-md border border-[#E8DFC8] font-mono">
                gemini-3.1-pro-preview
              </span>
              <span className="bg-[#FAF7F2] text-emerald-900 px-2 py-0.5 rounded-md border border-[#E8DFC8] font-mono">
                gemini-3.1-flash-lite
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenChat()}
            className="w-full py-2.5 px-4 bg-[#A84B2C] hover:bg-[#8F3C20] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open AI Chat Assistant</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* 2. Real-Time Hands-Free Voice Assistant */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-xs hover:border-[#1C442A]/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-1" />
                Live API
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#2D241E] font-display">
                Real-Time Voice Assistant
              </h3>
              <p className="text-xs text-[#7A6A5D] mt-1 leading-relaxed">
                Talk directly to Paati at the stove with low-latency bidirectional voice audio. Hands-free while stirring, chopping, or tempering.
              </p>
            </div>

            {/* Model badge */}
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span className="bg-[#FAF7F2] text-emerald-900 px-2 py-0.5 rounded-md border border-[#E8DFC8] font-mono font-bold">
                gemini-3.8-live
              </span>
              <span className="bg-[#FAF7F2] text-[#5A4B3E] px-2 py-0.5 rounded-md border border-[#E8DFC8]">
                PCM 16kHz & 24kHz
              </span>
            </div>
          </div>

          <button
            onClick={onOpenLiveVoice}
            className="w-full py-2.5 px-4 bg-[#1C442A] hover:bg-[#153420] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Mic className="w-4 h-4 text-emerald-300" />
            <span>Launch Live Voice Mode</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* 3. Image Studio & Plating Editor */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-xs hover:border-amber-600/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/20">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Create & Edit
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#2D241E] font-display">
                Dish Visualizer & Image Studio
              </h3>
              <p className="text-xs text-[#7A6A5D] mt-1 leading-relaxed">
                Prompt AI to create beautiful banana leaf spreads, or upload a photo to add curry leaves, chutneys, and authentic garnishes.
              </p>
            </div>

            {/* Model badge */}
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span className="bg-[#FAF7F2] text-rose-900 px-2 py-0.5 rounded-md border border-[#E8DFC8] font-mono font-bold">
                gemini-3.1-flash-image-preview
              </span>
              <span className="bg-[#FAF7F2] text-[#5A4B3E] px-2 py-0.5 rounded-md border border-[#E8DFC8]">
                1:1, 16:9, 9:16
              </span>
            </div>
          </div>

          <button
            onClick={onOpenImageStudio}
            className="w-full py-2.5 px-4 bg-[#B8532F] hover:bg-[#9E4424] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <ImageIcon className="w-4 h-4 text-amber-200" />
            <span>Open Image Studio</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* 4. Veo Video Generations */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-xs hover:border-purple-600/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-purple-700/20">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Veo Video
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#2D241E] font-display">
                Veo Photo-to-Video Animation
              </h3>
              <p className="text-xs text-[#7A6A5D] mt-1 leading-relaxed">
                Animate any dish photo into steaming, sizzling video clips with cinematic South Indian kitchen lighting.
              </p>
            </div>

            {/* Model badge */}
            <div className="flex flex-wrap gap-1 text-[10px]">
              <span className="bg-[#FAF7F2] text-purple-900 px-2 py-0.5 rounded-md border border-[#E8DFC8] font-mono font-bold">
                veo-3.1-fast-generate-preview
              </span>
              <span className="bg-[#FAF7F2] text-[#5A4B3E] px-2 py-0.5 rounded-md border border-[#E8DFC8]">
                16:9 & 9:16
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenVeoVideo()}
            className="w-full py-2.5 px-4 bg-[#3D2660] hover:bg-[#2F1D4A] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Film className="w-4 h-4 text-purple-300" />
            <span>Launch Veo Video Studio</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Quick Cooking Steps Access for Today's Dishes */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-[#2D241E] flex items-center">
              <Flame className="w-4 h-4 text-[#A84B2C] mr-1.5" />
              <span>Step-by-Step Cooking for Today's Menu</span>
            </h3>
            <p className="text-xs text-[#7A6A5D]">
              Clear visual checkpoints, flame intensity indicators, and interactive kitchen timers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Breakfast */}
          <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8] space-y-2">
            <span className="text-[10px] font-bold uppercase text-[#A84B2C] tracking-wider block">
              Breakfast Tiffin
            </span>
            <h4 className="font-bold text-xs text-[#2D241E] line-clamp-1">
              {currentMenu.breakfast.title}
            </h4>
            <div className="space-y-1">
              {currentMenu.breakfast.dishes.slice(0, 2).map((dish) => (
                <button
                  key={dish.id}
                  onClick={() => onSelectDish(dish)}
                  className="w-full text-left p-2 bg-white hover:bg-amber-50 rounded-xl border border-[#E8DFC8] text-xs font-medium text-[#4A3B2E] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="line-clamp-1">{dish.name}</span>
                  <ArrowRight className="w-3 h-3 text-[#A84B2C] flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Lunch */}
          <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8] space-y-2">
            <span className="text-[10px] font-bold uppercase text-[#2A5A3B] tracking-wider block">
              Lunch Combination
            </span>
            <h4 className="font-bold text-xs text-[#2D241E] line-clamp-1">
              {currentMenu.lunch.title}
            </h4>
            <div className="space-y-1">
              {currentMenu.lunch.dishes.slice(0, 2).map((dish) => (
                <button
                  key={dish.id}
                  onClick={() => onSelectDish(dish)}
                  className="w-full text-left p-2 bg-white hover:bg-emerald-50 rounded-xl border border-[#E8DFC8] text-xs font-medium text-[#4A3B2E] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="line-clamp-1">{dish.name}</span>
                  <ArrowRight className="w-3 h-3 text-[#2A5A3B] flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Dinner */}
          <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8] space-y-2">
            <span className="text-[10px] font-bold uppercase text-purple-700 tracking-wider block">
              Light Dinner
            </span>
            <h4 className="font-bold text-xs text-[#2D241E] line-clamp-1">
              {currentMenu.dinner.title}
            </h4>
            <div className="space-y-1">
              {currentMenu.dinner.dishes.slice(0, 2).map((dish) => (
                <button
                  key={dish.id}
                  onClick={() => onSelectDish(dish)}
                  className="w-full text-left p-2 bg-white hover:bg-purple-50 rounded-xl border border-[#E8DFC8] text-xs font-medium text-[#4A3B2E] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="line-clamp-1">{dish.name}</span>
                  <ArrowRight className="w-3 h-3 text-purple-700 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

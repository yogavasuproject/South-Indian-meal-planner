import React, { useState, useEffect } from 'react';
import { 
  X, Clock, Users, ChefHat, Sparkles, CheckCircle2, 
  Flame, Timer, Play, Pause, RotateCcw, Volume2, 
  MessageSquare, Camera, Check, ChevronRight, ChevronLeft, AlertCircle
} from 'lucide-react';
import { Dish, Ingredient } from '../types/meal';
import { scaleRecipeIngredients } from '../services/southIndianDatabase';

interface RecipeModalProps {
  dish: Dish | null;
  onClose: () => void;
  initialServings: number;
  onOpenChatWithDish?: (dishName: string) => void;
  onOpenImageStudioWithDish?: (dish: Dish) => void;
  onOpenVoiceAssistant?: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  dish,
  onClose,
  initialServings,
  onOpenChatWithDish,
  onOpenImageStudioWithDish,
  onOpenVoiceAssistant
}) => {
  if (!dish) return null;

  const [currentServings, setCurrentServings] = useState<number>(dish.servings || initialServings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  
  // Kitchen Focus / Step-by-Step Interactive Cook Mode
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Step Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Play gentle chime
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
              gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
              osc.start();
              osc.stop(audioCtx.currentTime + 1.2);
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimerForMinutes = (mins: number) => {
    setTimerSeconds(mins * 60);
    setIsTimerRunning(true);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleCheck = (idx: number) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const scaledIngredients = scaleRecipeIngredients(
    dish.ingredients || [],
    dish.servings || 4,
    currentServings
  );

  const stepsList = dish.steps && dish.steps.length > 0 
    ? dish.steps 
    : [
        "Rinse and prep all fresh ingredients and measuring spices.",
        "Heat sesame/gingelly oil or ghee in a traditional pot or kadai.",
        "Temper mustard seeds, curry leaves, and asafoetida until fragrant.",
        "Add main ingredients, sauté gently on medium flame.",
        "Simmer covered until flavors harmonize completely.",
        "Garnish with fresh coriander or tempering and serve piping hot."
      ];

  // Derive flame indicator from step text
  const getFlameForStep = (stepText: string): { label: string; flames: number } => {
    const lower = stepText.toLowerCase();
    if (lower.includes('high flame') || lower.includes('boil vigorously') || lower.includes('crackle')) {
      return { label: 'High Flame', flames: 3 };
    }
    if (lower.includes('low flame') || lower.includes('simmer') || lower.includes('dum') || lower.includes('slowly')) {
      return { label: 'Low Flame / Simmer', flames: 1 };
    }
    return { label: 'Medium Flame', flames: 2 };
  };

  // Derive visual checkpoint from step text
  const getVisualCheckpoint = (stepText: string, idx: number): string => {
    const lower = stepText.toLowerCase();
    if (lower.includes('mustard') || lower.includes('temper')) {
      return "Mustard seeds must crackle completely and curry leaves turn crisp without browning dark.";
    }
    if (lower.includes('onion') || lower.includes('shallot')) {
      return "Onions turn translucent pinkish-gold with sweet caramelized aroma.";
    }
    if (lower.includes('tomato')) {
      return "Tomatoes break down into a thick, glossy pulp and oil starts releasing at edges.";
    }
    if (lower.includes('dal') || lower.includes('sambar') || lower.includes('kuzhambu')) {
      return "Frothy aroma rises, raw spice smell completely disappears, consistency becomes velvety.";
    }
    if (lower.includes('dosa') || lower.includes('roast')) {
      return "Golden brown ring forms around edges; lifts effortlessly from tawa.";
    }
    return "Check for aromatic steam and balanced color before proceeding to next step.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] flex flex-col overflow-hidden text-[#2D241E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="bg-gradient-to-r from-[#1C442A] to-[#2A5A3B] text-white p-5 pb-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>{dish.category}</span>
            <span>•</span>
            <span>{dish.isVegetarian ? '🌱 Pure Vegetarian' : '🍗 Non-Vegetarian'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-amber-50">
            {dish.name}
          </h2>
          {dish.tamilName && (
            <p className="text-emerald-100/90 text-sm font-medium mt-0.5">
              {dish.tamilName}
            </p>
          )}

          <p className="text-white/80 text-xs mt-2 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>

          {/* Quick Metrics & Mode Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/15 text-xs text-white/90">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-amber-300" />
                <span>Prep: {dish.prepTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <ChefHat className="w-3.5 h-3.5 mr-1 text-amber-300" />
                <span>Cook: {dish.cookTime}</span>
              </div>
            </div>

            {/* Cook Mode Switcher */}
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer ${
                isFocusMode
                  ? 'bg-amber-400 text-amber-950 shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{isFocusMode ? 'Exit Kitchen Cook Mode' : 'Enter Kitchen Cook Mode'}</span>
            </button>
          </div>
        </div>

        {/* Scalable Servings & Kitchen Timer Bar */}
        <div className="bg-[#F3ECE2] px-5 py-2.5 border-b border-[#E2D5C3] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#5A4B3E] flex items-center">
              <Users className="w-3.5 h-3.5 mr-1 text-[#A84B2C]" />
              Servings:
            </span>
            <div className="flex items-center space-x-1">
              {[2, 4, 6, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setCurrentServings(s)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                    currentServings === s
                      ? 'bg-[#A84B2C] text-white shadow-xs'
                      : 'bg-white text-[#5A4B3E] border border-[#E2D5C3] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Kitchen Timer Widget */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-xl border border-[#E2D5C3]">
            <Timer className="w-3.5 h-3.5 text-[#A84B2C]" />
            <span className="font-mono font-bold text-xs text-[#2D241E]">
              {formatTimer(timerSeconds)}
            </span>
            {timerSeconds > 0 ? (
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-[11px] font-bold text-[#A84B2C] hover:underline"
              >
                {isTimerRunning ? 'Pause' : 'Resume'}
              </button>
            ) : (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => startTimerForMinutes(3)}
                  className="text-[10px] bg-[#FAF7F2] hover:bg-amber-100 px-1.5 py-0.5 rounded border border-[#E2D5C3] text-[#5A4B3E]"
                >
                  +3m
                </button>
                <button
                  onClick={() => startTimerForMinutes(5)}
                  className="text-[10px] bg-[#FAF7F2] hover:bg-amber-100 px-1.5 py-0.5 rounded border border-[#E2D5C3] text-[#5A4B3E]"
                >
                  +5m
                </button>
                <button
                  onClick={() => startTimerForMinutes(10)}
                  className="text-[10px] bg-[#FAF7F2] hover:bg-amber-100 px-1.5 py-0.5 rounded border border-[#E2D5C3] text-[#5A4B3E]"
                >
                  +10m
                </button>
              </div>
            )}
            {timerSeconds > 0 && (
              <button
                onClick={() => {
                  setTimerSeconds(0);
                  setIsTimerRunning(false);
                }}
                className="text-gray-400 hover:text-gray-600"
                title="Reset timer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* FOCUS COOK MODE (When active) */}
          {isFocusMode ? (
            <div className="space-y-4">
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-[#7A6A5D]">
                  <span className="font-bold">
                    Cooking Step {activeStepIndex + 1} of {stepsList.length}
                  </span>
                  <span>{Math.round(((activeStepIndex + 1) / stepsList.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-[#EAE2D5] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#2A5A3B] h-full transition-all duration-300"
                    style={{ width: `${((activeStepIndex + 1) / stepsList.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Active Step Card (Phone Counter Friendly Large Typography) */}
              <div className="bg-white p-6 rounded-3xl border-2 border-[#2A5A3B] shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#2A5A3B] text-white rounded-full font-bold text-xs">
                    Step {activeStepIndex + 1}
                  </span>

                  {/* Flame Guide */}
                  {(() => {
                    const flameInfo = getFlameForStep(stepsList[activeStepIndex]);
                    return (
                      <div className="flex items-center space-x-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-bold">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>{flameInfo.label}</span>
                      </div>
                    );
                  })()}
                </div>

                <p className="text-base sm:text-lg font-medium text-[#2D241E] leading-relaxed">
                  {stepsList[activeStepIndex]}
                </p>

                {/* Visual Checkpoint Guidance */}
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Visual Milestone Checkpoint:</span>
                  </div>
                  <p className="leading-relaxed">
                    {getVisualCheckpoint(stepsList[activeStepIndex], activeStepIndex)}
                  </p>
                </div>

                {/* Step Completion Checkbox */}
                <button
                  onClick={() => toggleStep(activeStepIndex)}
                  className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    completedSteps[activeStepIndex]
                      ? 'bg-emerald-600 text-white border-transparent'
                      : 'bg-[#FAF7F2] text-[#2D241E] border-[#E8DFC8] hover:bg-[#F3ECE2]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {completedSteps[activeStepIndex] ? 'Step Completed! ✓' : 'Mark Step as Done'}
                  </span>
                </button>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                  disabled={activeStepIndex === 0}
                  className="flex-1 py-3 px-4 rounded-2xl bg-white border border-[#E8DFC8] text-[#2D241E] font-bold text-xs disabled:opacity-40 flex items-center justify-center space-x-1.5 shadow-xs hover:bg-[#FAF7F2] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <button
                  onClick={() => setActiveStepIndex(Math.min(stepsList.length - 1, activeStepIndex + 1))}
                  disabled={activeStepIndex === stepsList.length - 1}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#2A5A3B] text-white font-bold text-xs disabled:opacity-40 flex items-center justify-center space-x-1.5 shadow-md hover:bg-[#1E432B] cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD INGREDIENTS & STEPS VIEW */
            <>
              {/* Ingredients Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-[#2D241E] flex items-center font-display">
                    <span className="w-2 h-2 rounded-full bg-[#A84B2C] mr-2"></span>
                    Ingredients for {currentServings} people
                  </h3>
                  <span className="text-[11px] text-[#7A6A5D]">Tap to check off</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scaledIngredients.map((ing, idx) => {
                    const isChecked = !!checkedIngredients[idx];
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleCheck(idx)}
                        className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'bg-[#EAE4DC]/60 border-transparent text-[#8A796C] line-through'
                            : 'bg-white border-[#E8DFC8] text-[#2D241E] shadow-2xs hover:border-[#A84B2C]/40'
                        }`}
                      >
                        <div>
                          <span className="font-medium text-xs sm:text-sm">{ing.name}</span>
                          {ing.category && (
                            <span className="block text-[10px] text-[#7A6A5D] capitalize">
                              {ing.category}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ml-2 flex-shrink-0 ${
                          isChecked ? 'bg-[#DDD2C4] text-[#7A6A5D]' : 'bg-[#F3ECE2] text-[#A84B2C]'
                        }`}>
                          {ing.quantity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Instructions Step-by-Step with Flame Guidance & Checkpoints */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-[#2D241E] flex items-center font-display">
                    <span className="w-2 h-2 rounded-full bg-[#2A5A3B] mr-2"></span>
                    Step-by-Step Cooking
                  </h3>
                  <span className="text-[11px] text-[#7A6A5D]">
                    {Object.values(completedSteps).filter(Boolean).length}/{stepsList.length} done
                  </span>
                </div>

                <ol className="space-y-3">
                  {stepsList.map((step, idx) => {
                    const isDone = !!completedSteps[idx];
                    const flame = getFlameForStep(step);
                    const checkpoint = getVisualCheckpoint(step, idx);

                    return (
                      <li 
                        key={idx} 
                        className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                          isDone 
                            ? 'bg-[#EAE4DC]/40 border-transparent text-[#8A796C]' 
                            : 'bg-white border-[#E8DFC8] text-[#2D241E] shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleStep(idx)}
                              className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors cursor-pointer ${
                                isDone 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-[#EAE2D5] text-[#7A5A40] hover:bg-[#A84B2C] hover:text-white'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </button>
                            <span className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through' : ''}`}>
                              {step}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 flex-shrink-0 text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span>{flame.label}</span>
                          </div>
                        </div>

                        {/* Visual Milestone Checkpoint Box */}
                        <div className="ml-9 p-2 bg-[#FAF7F2] rounded-xl border border-[#EFE8DD] text-[11px] text-[#6A5A4E] leading-relaxed flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Visual check:</strong> {checkpoint}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>

              {/* Tips & Secret Touch */}
              {(dish.tips || dish.substitutions) && (
                <div className="space-y-2 pt-2 border-t border-[#E8DFC8]">
                  {dish.tips && (
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start">
                      <Sparkles className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Grandma's Secret Kaipakuva Tip: </span>
                        {dish.tips}
                      </div>
                    </div>
                  )}

                  {dish.substitutions && (
                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 leading-relaxed">
                      <span className="font-bold">Smart Substitution: </span>
                      {dish.substitutions}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with AI Companion Shortcuts */}
        <div className="p-3.5 sm:p-4 bg-[#F3ECE2] border-t border-[#E2D5C3] flex flex-wrap items-center justify-between gap-2">
          {/* Quick AI Help Links */}
          <div className="flex items-center gap-2">
            {onOpenChatWithDish && (
              <button
                onClick={() => onOpenChatWithDish(dish.name)}
                className="py-1.5 px-3 bg-white border border-[#E8DFC8] hover:bg-[#FAF7F2] rounded-xl text-xs font-bold text-[#2D241E] flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Ask chef doubts about this dish"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#A84B2C]" />
                <span className="hidden sm:inline">Ask AI Chef</span>
              </button>
            )}

            {onOpenImageStudioWithDish && (
              <button
                onClick={() => onOpenImageStudioWithDish(dish)}
                className="py-1.5 px-3 bg-white border border-[#E8DFC8] hover:bg-[#FAF7F2] rounded-xl text-xs font-bold text-[#2D241E] flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Visualize dish plating in AI Studio"
              >
                <Camera className="w-3.5 h-3.5 text-[#A84B2C]" />
                <span className="hidden sm:inline">Style Photo</span>
              </button>
            )}

            {onOpenVoiceAssistant && (
              <button
                onClick={onOpenVoiceAssistant}
                className="py-1.5 px-3 bg-white border border-[#E8DFC8] hover:bg-[#FAF7F2] rounded-xl text-xs font-bold text-[#2D241E] flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Open hands-free cooking assistant"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Voice Mode</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2D241E] hover:bg-[#40332B] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Done Cooking
          </button>
        </div>
      </div>
    </div>
  );
};

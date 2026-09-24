import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, AlertCircle, ChefHat, 
  UtensilsCrossed, CheckCircle, ArrowRight, MessageSquare, 
  Mic, Image as ImageIcon, Film 
} from 'lucide-react';
import { DailyMenu, Dish, UserPreferences, WeeklyPlan } from './types/meal';
import { 
  loadStoredPreferences, saveStoredPreferences, loadCurrentMenu, 
  saveCurrentMenu, loadSavedMenus, toggleSaveMenu, loadMenuHistory, 
  addToMenuHistory, apiGenerateMenu, apiSwapMealSlot, apiGenerateWeeklyPlan, 
  loadStoredWeeklyPlan 
} from './services/api';
import { Header } from './components/Header';
import { PreferenceChips } from './components/PreferenceChips';
import { IdeaShortcuts } from './components/IdeaShortcuts';
import { MenuCard } from './components/MenuCard';
import { ActionToolbar } from './components/ActionToolbar';
import { RecipeModal } from './components/RecipeModal';
import { AllRecipesModal } from './components/AllRecipesModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { UseIngredientsModal } from './components/UseIngredientsModal';
import { PreferencesModal } from './components/PreferencesModal';
import { WeeklyPlanView } from './components/WeeklyPlanView';
import { HistorySavedView } from './components/HistorySavedView';
import { AISuiteView } from './components/AISuiteView';
import { GeminiChatModal } from './components/GeminiChatModal';
import { ImageStudioModal } from './components/ImageStudioModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { VeoVideoModal } from './components/VeoVideoModal';
import { BottomNavBar, NavTab } from './components/BottomNavBar';

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(loadStoredPreferences);
  const [currentMenu, setCurrentMenu] = useState<DailyMenu>(loadCurrentMenu);
  const [savedMenus, setSavedMenus] = useState<DailyMenu[]>(loadSavedMenus);
  const [history, setHistory] = useState<DailyMenu[]>(loadMenuHistory);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(loadStoredWeeklyPlan);

  // Active view tab
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('home');

  // Modals state
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // AI Feature Modals state
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageInitialDish, setImageInitialDish] = useState<Dish | null>(null);
  const [showLiveVoiceModal, setShowLiveVoiceModal] = useState(false);
  const [showVeoModal, setShowVeoModal] = useState(false);
  const [veoInitialImage, setVeoInitialImage] = useState<string | null>(null);
  const [veoInitialPrompt, setVeoInitialPrompt] = useState<string>('');

  // Loading & error state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWeeklyGenerating, setIsWeeklyGenerating] = useState(false);
  const [swappingSlotKey, setSwappingSlotKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check if current menu is in saved list
  const isCurrentMenuSaved = savedMenus.some(
    m => m.id === currentMenu.id || m.title === currentMenu.title
  );

  // Generate Menu
  const handleGenerateMenu = async (customOverridePrompt?: string, considerHistory = true) => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      // Find yesterday's / last menu to prevent repeats
      const previousMenuToAvoid = considerHistory && history.length > 0 ? history[0] : null;
      const newMenu = await apiGenerateMenu(preferences, customOverridePrompt, previousMenuToAvoid);
      
      setCurrentMenu(newMenu);
      setHistory(loadMenuHistory());
      triggerToast(customOverridePrompt ? 'Menu customized!' : "Today's fresh menu generated!");
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMessage('Unable to generate menu right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Swap Single Meal Slot (e.g. Change Breakfast / Lunch / Dinner)
  const handleSwapSlot = async (slotKey: 'breakfast' | 'lunch' | 'snack' | 'dinner', customRequest?: string) => {
    setSwappingSlotKey(slotKey);
    try {
      const updatedMenu = await apiSwapMealSlot(slotKey, currentMenu, preferences, customRequest);
      setCurrentMenu(updatedMenu);
      triggerToast(`New ${slotKey} suggested!`);
    } catch (err) {
      console.error('Swap failed:', err);
      triggerToast(`Could not swap ${slotKey}. Please try again.`);
    } finally {
      setSwappingSlotKey(null);
    }
  };

  // Generate Weekly Plan
  const handleGenerateWeekly = async () => {
    setIsWeeklyGenerating(true);
    try {
      const plan = await apiGenerateWeeklyPlan(preferences);
      setWeeklyPlan(plan);
      triggerToast('7-Day Plan created with optimal variety!');
    } catch (err) {
      console.error('Weekly plan failed:', err);
      triggerToast('Failed to generate weekly plan. Please retry.');
    } finally {
      setIsWeeklyGenerating(false);
    }
  };

  // Save / Toggle Favorite Menu
  const handleToggleFavorite = () => {
    const isSaved = toggleSaveMenu(currentMenu);
    setSavedMenus(loadSavedMenus());
    triggerToast(isSaved ? 'Saved to your favorite menus ❤️' : 'Removed from favorites');
  };

  // Add to Weekly Plan
  const handleAddToWeeklyPlan = () => {
    if (!weeklyPlan) {
      const newPlan: WeeklyPlan = {
        id: `weekly-${Date.now()}`,
        title: 'My Custom Weekly Plan',
        createdAt: new Date().toISOString(),
        days: [
          { dayName: 'Today', menu: currentMenu },
          { dayName: 'Tomorrow', menu: currentMenu }
        ],
        weeklyShoppingList: currentMenu.shoppingList
      };
      setWeeklyPlan(newPlan);
      localStorage.setItem('enna_samayal_weekly_plan_v1', JSON.stringify(newPlan));
    }
    setActiveNavTab('weekly');
    triggerToast("Added to your Weekly Plan!");
  };

  // Update Servings from Header
  const handleUpdateServings = (newServings: number) => {
    const updated = { ...preferences, servings: newServings };
    setPreferences(updated);
    saveStoredPreferences(updated);
    setCurrentMenu(prev => ({ ...prev, servings: newServings }));
    triggerToast(`Portion scaled to ${newServings} people`);
  };

  // Update Preferences from Modal
  const handleSavePreferences = (updated: UserPreferences) => {
    setPreferences(updated);
    saveStoredPreferences(updated);
    triggerToast('Preferences saved!');
    handleGenerateMenu();
  };

  // Apply Ingredients from Fridge & Regenerate
  const handleApplyIngredients = (ingredients: string[]) => {
    const updated = { ...preferences, availableIngredients: ingredients };
    setPreferences(updated);
    saveStoredPreferences(updated);
    setShowIngredientsModal(false);
    handleGenerateMenu(`Prioritize using available ingredients: ${ingredients.slice(0, 5).join(', ')}`);
  };

  // Calculate total items needed for shopping badge
  const totalShoppingItems = currentMenu.shoppingList?.reduce(
    (total, cat) => total + cat.items.filter(i => !i.haveAtHome).length,
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2D241E]">
      {/* App Header */}
      <Header
        preferences={preferences}
        onOpenPreferences={() => setShowPreferencesModal(true)}
        onUpdateServings={handleUpdateServings}
      />

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2D241E] text-amber-50 px-4 py-2 rounded-2xl shadow-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleGenerateMenu()}
              className="px-3 py-1 bg-rose-700 text-white rounded-lg font-bold hover:bg-rose-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* VIEW 1: HOME (Daily Planner) */}
        {activeNavTab === 'home' && (
          <div className="space-y-5">
            {/* Hero Question & Generator CTA */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A84B2C]">
                  இன்னைக்கு என்ன சமையல்?
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#2D241E]">
                  What are we cooking today?
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6A5D]">
                  Tap generate to prepare a complete, balanced South Indian household menu with smart ingredient reuse.
                </p>
              </div>

              {/* Quick Preferences Chips */}
              <PreferenceChips
                preferences={preferences}
                onChangePreferences={(newPrefs) => {
                  setPreferences(newPrefs);
                  saveStoredPreferences(newPrefs);
                }}
                onOpenPreferences={() => setShowPreferencesModal(true)}
              />

              {/* Main Primary CTA Button */}
              <button
                onClick={() => handleGenerateMenu()}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#A84B2C] to-[#C75B35] hover:from-[#923C20] hover:to-[#B34E2A] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#A84B2C]/25 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-5 h-5 text-amber-200 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating ? "Planning Today's Meals..." : "Generate Today's Menu"}
                </span>
              </button>

              {/* Running out of ideas? Section */}
              <IdeaShortcuts
                onSelectShortcut={(type, promptText) => handleGenerateMenu(promptText)}
                onOpenIngredientsModal={() => setShowIngredientsModal(true)}
                isLoading={isGenerating}
              />
            </div>

            {/* Quick AI Superpowers Toolbar on Home */}
            <div className="bg-gradient-to-r from-[#FAF7F2] to-[#F3ECE2] p-3.5 rounded-3xl border border-[#E8DFC8] shadow-2xs">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6A5D] flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                  Gemini Kitchen AI Tools
                </span>
                <button
                  onClick={() => setActiveNavTab('ai')}
                  className="text-[11px] font-bold text-[#A84B2C] hover:underline flex items-center cursor-pointer"
                >
                  <span>Explore Suite</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    setChatInitialPrompt('');
                    setShowChatModal(true);
                  }}
                  className="p-2.5 bg-white hover:bg-amber-50/60 rounded-2xl border border-[#E8DFC8] text-left transition-all cursor-pointer flex items-center space-x-2.5 shadow-2xs hover:scale-[1.01]"
                >
                  <span className="text-xl p-1.5 bg-amber-100/70 rounded-xl flex-shrink-0">👵</span>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#2D241E] block truncate">Paati & Chef</span>
                    <span className="text-[10px] text-[#7A6A5D] block truncate">AI Chatbot</span>
                  </div>
                </button>

                <button
                  onClick={() => setShowLiveVoiceModal(true)}
                  className="p-2.5 bg-white hover:bg-emerald-50/60 rounded-2xl border border-[#E8DFC8] text-left transition-all cursor-pointer flex items-center space-x-2.5 shadow-2xs hover:scale-[1.01]"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-800">
                    <Mic className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#2D241E] block truncate">Hands-Free</span>
                    <span className="text-[10px] text-[#7A6A5D] block truncate">Live 3.8 Voice</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setImageInitialDish(null);
                    setShowImageModal(true);
                  }}
                  className="p-2.5 bg-white hover:bg-rose-50/60 rounded-2xl border border-[#E8DFC8] text-left transition-all cursor-pointer flex items-center space-x-2.5 shadow-2xs hover:scale-[1.01]"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-800">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#2D241E] block truncate">Image Studio</span>
                    <span className="text-[10px] text-[#7A6A5D] block truncate">Style & Visuals</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setVeoInitialImage(null);
                    setVeoInitialPrompt('');
                    setShowVeoModal(true);
                  }}
                  className="p-2.5 bg-white hover:bg-purple-50/60 rounded-2xl border border-[#E8DFC8] text-left transition-all cursor-pointer flex items-center space-x-2.5 shadow-2xs hover:scale-[1.01]"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-800">
                    <Film className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#2D241E] block truncate">Veo Video</span>
                    <span className="text-[10px] text-[#7A6A5D] block truncate">Animate Dish</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Daily Menu Card */}
            <MenuCard
              menu={currentMenu}
              onSelectDish={(dish) => setSelectedDish(dish)}
              onSwapSlot={handleSwapSlot}
              isSwappingSlot={swappingSlotKey}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isCurrentMenuSaved}
            />

            {/* Action Buttons Toolbar & Natural Language Override */}
            <ActionToolbar
              onRegenerateFullMenu={(override) => handleGenerateMenu(override)}
              onOpenAllRecipes={() => setShowAllRecipes(true)}
              onOpenShoppingList={() => setShowShoppingModal(true)}
              onOpenIngredientsModal={() => setShowIngredientsModal(true)}
              onSaveMenu={handleToggleFavorite}
              onAddToWeeklyPlan={handleAddToWeeklyPlan}
              isGenerating={isGenerating}
              isSaved={isCurrentMenuSaved}
            />
          </div>
        )}

        {/* VIEW 2: WEEKLY PLAN */}
        {activeNavTab === 'weekly' && (
          <WeeklyPlanView
            weeklyPlan={weeklyPlan}
            onGenerateWeekly={handleGenerateWeekly}
            isLoading={isWeeklyGenerating}
            onSelectDayAsToday={(dayMenu) => {
              setCurrentMenu(dayMenu);
              saveCurrentMenu(dayMenu);
              setActiveNavTab('home');
              triggerToast(`Set ${dayMenu.title} as today's menu!`);
            }}
            onSelectDish={(dish) => setSelectedDish(dish)}
          />
        )}

        {/* VIEW 3: AI SUITE DEDICATED VIEW */}
        {activeNavTab === 'ai' && (
          <AISuiteView
            currentMenu={currentMenu}
            onOpenChat={(prompt) => {
              setChatInitialPrompt(prompt || '');
              setShowChatModal(true);
            }}
            onOpenImageStudio={() => {
              setImageInitialDish(null);
              setShowImageModal(true);
            }}
            onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
            onOpenVeoVideo={(img, prompt) => {
              setVeoInitialImage(img || null);
              setVeoInitialPrompt(prompt || '');
              setShowVeoModal(true);
            }}
            onSelectDish={(dish) => setSelectedDish(dish)}
          />
        )}

        {/* VIEW 4: SHOPPING LIST */}
        {activeNavTab === 'shopping' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-2">
              <h2 className="text-xl font-bold font-display text-[#2D241E]">
                🛒 Active Kitchen Groceries
              </h2>
              <p className="text-xs text-[#7A6A5D]">
                Consolidated from {currentMenu.title} for {currentMenu.servings} people.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8DFC8] p-5 shadow-xs">
              <button
                onClick={() => setShowShoppingModal(true)}
                className="w-full py-3 rounded-2xl bg-[#A84B2C] text-white font-bold text-xs shadow-xs hover:bg-[#8F3C20] transition-colors cursor-pointer"
              >
                Open Interactive Checklist & WhatsApp Export
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {currentMenu.shoppingList?.map((cat, idx) => (
                  <div key={idx} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFC8]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#A84B2C] mb-2">
                      {cat.category}
                    </h3>
                    <ul className="space-y-1.5 text-xs text-[#3D3028]">
                      {cat.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-center justify-between py-1 border-b border-[#EFE8DD] last:border-0">
                          <span className={item.haveAtHome ? 'text-[#8A796C]' : 'font-medium'}>
                            {item.name}
                          </span>
                          <span className="font-bold text-[#7A5A40] bg-[#EAE2D5] px-2 py-0.5 rounded text-[11px]">
                            {item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: SAVED & HISTORY */}
        {activeNavTab === 'saved' && (
          <HistorySavedView
            history={history}
            savedMenus={savedMenus}
            currentMenu={currentMenu}
            onSelectMenuAsCurrent={(menu) => {
              setCurrentMenu(menu);
              saveCurrentMenu(menu);
              setActiveNavTab('home');
              triggerToast('Loaded selected menu!');
            }}
            onSelectDish={(dish) => setSelectedDish(dish)}
            onRegenerateAvoidingHistory={() => {
              setActiveNavTab('home');
              handleGenerateMenu("Completely different meal varieties avoiding yesterday's menu", true);
            }}
            isLoading={isGenerating}
          />
        )}

        {/* VIEW 6: PREFERENCES */}
        {activeNavTab === 'preferences' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-xs">
              <h2 className="text-xl font-bold font-display text-[#2D241E]">
                ⚙️ Cooking & Household Settings
              </h2>
              <p className="text-xs text-[#7A6A5D] mt-0.5">
                Update dietary restrictions, spice level, household size, and pantry ingredients.
              </p>

              <div className="mt-4">
                <button
                  onClick={() => setShowPreferencesModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#A84B2C] text-white font-bold text-xs shadow-xs hover:bg-[#8F3C20] transition-colors cursor-pointer"
                >
                  Edit Detailed Preferences
                </button>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-sm text-[#2D241E]">Current Active Configuration:</h3>
              <div className="grid grid-cols-2 gap-2 text-[#4A3B2E]">
                <div className="bg-[#FAF7F2] p-3 rounded-xl">
                  <span className="text-[#8A796C] block font-bold text-[10px] uppercase">Servings</span>
                  <span className="font-bold text-sm">{preferences.servings} people</span>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-xl">
                  <span className="text-[#8A796C] block font-bold text-[10px] uppercase">Diet</span>
                  <span className="font-bold text-sm capitalize">{preferences.dietType}</span>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-xl">
                  <span className="text-[#8A796C] block font-bold text-[10px] uppercase">Cuisine</span>
                  <span className="font-bold text-sm capitalize">{preferences.cuisine} Style</span>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-xl">
                  <span className="text-[#8A796C] block font-bold text-[10px] uppercase">Spice</span>
                  <span className="font-bold text-sm capitalize">{preferences.spice}</span>
                </div>
              </div>

              {preferences.availableIngredients.length > 0 && (
                <div className="pt-2">
                  <span className="text-[#8A796C] block font-bold text-[10px] uppercase mb-1">
                    Ingredients in Pantry ({preferences.availableIngredients.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {preferences.availableIngredients.map((item, idx) => (
                      <span key={idx} className="bg-[#F3ECE2] text-[#4A3B2E] px-2 py-0.5 rounded-md font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeNavTab}
        onChangeTab={setActiveNavTab}
        shoppingCount={totalShoppingItems}
      />

      {/* MODALS */}
      {/* 1. Single Dish Recipe Modal with Kitchen Focus Mode & AI Shortcuts */}
      {selectedDish && (
        <RecipeModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          initialServings={preferences.servings}
          onOpenChatWithDish={(dishName) => {
            setChatInitialPrompt(`How do I make ${dishName} perfectly? Any secret grandmother Kaipakuva tips?`);
            setShowChatModal(true);
          }}
          onOpenImageStudioWithDish={(dish) => {
            setImageInitialDish(dish);
            setShowImageModal(true);
          }}
          onOpenVoiceAssistant={() => setShowLiveVoiceModal(true)}
        />
      )}

      {/* 2. All Recipes Modal */}
      {showAllRecipes && (
        <AllRecipesModal
          menu={currentMenu}
          onClose={() => setShowAllRecipes(false)}
        />
      )}

      {/* 3. Consolidated Shopping List Modal */}
      {showShoppingModal && (
        <ShoppingListModal
          menu={currentMenu}
          onClose={() => setShowShoppingModal(false)}
        />
      )}

      {/* 4. Use My Ingredients Modal */}
      {showIngredientsModal && (
        <UseIngredientsModal
          currentIngredients={preferences.availableIngredients}
          onApplyAndGenerate={handleApplyIngredients}
          onClose={() => setShowIngredientsModal(false)}
          isLoading={isGenerating}
        />
      )}

      {/* 5. Preferences Modal */}
      {showPreferencesModal && (
        <PreferencesModal
          preferences={preferences}
          onSavePreferences={handleSavePreferences}
          onClose={() => setShowPreferencesModal(false)}
        />
      )}

      {/* 6. Gemini Multi-Turn Chatbot Modal */}
      {showChatModal && (
        <GeminiChatModal
          onClose={() => setShowChatModal(false)}
          currentMenu={currentMenu}
          initialPrompt={chatInitialPrompt}
        />
      )}

      {/* 7. Image Studio Modal (gemini-3.1-flash-image-preview) */}
      {showImageModal && (
        <ImageStudioModal
          onClose={() => {
            setShowImageModal(false);
            setImageInitialDish(null);
          }}
          initialDish={imageInitialDish}
          onAnimateInVeo={(imgUrl, prompt) => {
            setShowImageModal(false);
            setVeoInitialImage(imgUrl);
            setVeoInitialPrompt(prompt);
            setShowVeoModal(true);
          }}
        />
      )}

      {/* 8. Live Voice API Modal (gemini-3.8-live) */}
      {showLiveVoiceModal && (
        <LiveVoiceModal
          onClose={() => setShowLiveVoiceModal(false)}
          currentMenu={currentMenu}
        />
      )}

      {/* 9. Veo Video Modal (veo-3.1-fast-generate-preview) */}
      {showVeoModal && (
        <VeoVideoModal
          onClose={() => {
            setShowVeoModal(false);
            setVeoInitialImage(null);
            setVeoInitialPrompt('');
          }}
          initialImage={veoInitialImage}
          initialPrompt={veoInitialPrompt}
        />
      )}
    </div>
  );
}


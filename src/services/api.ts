import { DailyMenu, UserPreferences, WeeklyPlan } from '../types/meal';
import { CURATED_MENUS } from './southIndianDatabase';

const STORAGE_KEYS = {
  PREFERENCES: 'enna_samayal_preferences_v1',
  CURRENT_MENU: 'enna_samayal_current_menu_v1',
  SAVED_MENUS: 'enna_samayal_saved_menus_v1',
  MENU_HISTORY: 'enna_samayal_menu_history_v1',
  WEEKLY_PLAN: 'enna_samayal_weekly_plan_v1',
  CUSTOM_SHOPPING: 'enna_samayal_custom_shopping_v1'
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  servings: 4,
  dietType: 'veg',
  cuisine: 'tamil',
  spice: 'medium',
  cookingTime: '30-60',
  budget: 'regular',
  dietaryRestrictions: [],
  availableIngredients: ['Tomatoes', 'Onions', 'Potatoes', 'Mustard Seeds', 'Toor Dal'],
  avoidIngredients: [],
  breakfastPref: '',
  lunchPref: '',
  dinnerPref: ''
};

export function loadStoredPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (data) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load preferences:', e);
  }
  return DEFAULT_PREFERENCES;
}

export function saveStoredPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
}

export function loadCurrentMenu(): DailyMenu {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_MENU);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load current menu:', e);
  }
  return CURATED_MENUS[0];
}

export function saveCurrentMenu(menu: DailyMenu): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MENU, JSON.stringify(menu));
    // Also record in history
    addToMenuHistory(menu);
  } catch (e) {
    console.error('Failed to save current menu:', e);
  }
}

export function loadSavedMenus(): DailyMenu[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_MENUS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleSaveMenu(menu: DailyMenu): boolean {
  try {
    const saved = loadSavedMenus();
    const index = saved.findIndex(m => m.id === menu.id || m.title === menu.title);
    let isNowSaved = false;
    if (index >= 0) {
      saved.splice(index, 1);
      isNowSaved = false;
    } else {
      saved.unshift({ ...menu, isFavorite: true });
      isNowSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_MENUS, JSON.stringify(saved));
    return isNowSaved;
  } catch {
    return false;
  }
}

export function loadMenuHistory(): DailyMenu[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MENU_HISTORY);
    return data ? JSON.parse(data) : [CURATED_MENUS[1]]; // include yesterday placeholder
  } catch {
    return [CURATED_MENUS[1]];
  }
}

export function addToMenuHistory(menu: DailyMenu): void {
  try {
    const history = loadMenuHistory();
    // avoid exact duplicates on top
    const filtered = history.filter(h => h.id !== menu.id && h.title !== menu.title);
    filtered.unshift(menu);
    // Keep last 14 days
    if (filtered.length > 14) filtered.length = 14;
    localStorage.setItem(STORAGE_KEYS.MENU_HISTORY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error saving history:', e);
  }
}

// API Calls
export async function apiGenerateMenu(
  preferences: UserPreferences,
  overridePrompt?: string,
  previousMenu?: Partial<DailyMenu> | null
): Promise<DailyMenu> {
  try {
    const res = await fetch('/api/generate-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences, overridePrompt, previousMenu })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    saveCurrentMenu(data);
    return data;
  } catch (err) {
    console.warn('API error, using local generator fallback:', err);
    // Use curated fallback
    const fallback = CURATED_MENUS[(Date.now() % CURATED_MENUS.length)];
    const cloned = JSON.parse(JSON.stringify(fallback));
    cloned.servings = preferences.servings;
    cloned.dietType = preferences.dietType;
    if (overridePrompt) cloned.title = `${cloned.title} (${overridePrompt})`;
    saveCurrentMenu(cloned);
    return cloned;
  }
}

export async function apiSwapMealSlot(
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  currentMenu: DailyMenu,
  preferences: UserPreferences,
  customRequest?: string
): Promise<DailyMenu> {
  try {
    const res = await fetch('/api/swap-meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealType, currentMenu, preferences, customRequest })
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    saveCurrentMenu(data);
    return data;
  } catch (err) {
    console.warn('Swap API error, using local fallback:', err);
    // Local swap
    const nextMenu = CURATED_MENUS.find(m => m.id !== currentMenu.id) || CURATED_MENUS[0];
    const cloned: DailyMenu = JSON.parse(JSON.stringify(currentMenu));
    cloned[mealType] = JSON.parse(JSON.stringify(nextMenu[mealType]));
    saveCurrentMenu(cloned);
    return cloned;
  }
}

export async function apiGenerateWeeklyPlan(preferences: UserPreferences): Promise<WeeklyPlan> {
  try {
    const res = await fetch('/api/generate-weekly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences })
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    localStorage.setItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn('Weekly API error, returning fallback:', err);
    // Simple fallback
    return {
      id: `weekly-${Date.now()}`,
      title: '7-Day South Indian Variety Plan',
      createdAt: new Date().toISOString(),
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => ({
        dayName: day,
        menu: CURATED_MENUS[idx % CURATED_MENUS.length]
      })),
      weeklyShoppingList: CURATED_MENUS[0].shoppingList
    };
  }
}

export function loadStoredWeeklyPlan(): WeeklyPlan | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// ----------------------------------------------------
// AI CLIENT INTEGRATIONS
// ----------------------------------------------------

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export async function apiSendChatMessage(
  messages: ChatMessage[],
  systemInstruction?: string,
  modelName: string = 'gemini-3.5-flash',
  menuContext?: string
): Promise<{ reply: string; modelUsed: string }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemInstruction, modelName, menuContext })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Chat failed' }));
    throw new Error(err.error || `Server error ${res.status}`);
  }
  return res.json();
}

export async function apiGenerateOrEditImage(
  prompt: string,
  aspectRatio: string = '1:1',
  baseImage?: string,
  mimeType?: string
): Promise<{ imageUrl: string; description?: string }> {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspectRatio, baseImage, mimeType })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Image generation failed' }));
    throw new Error(err.error || `Server error ${res.status}`);
  }
  return res.json();
}

export async function apiStartVeoVideo(
  prompt: string,
  aspectRatio: '16:9' | '9:16' = '16:9',
  imageBase64?: string,
  mimeType?: string
): Promise<{ operationName: string }> {
  const res = await fetch('/api/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspectRatio, imageBase64, mimeType })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Video request failed' }));
    throw new Error(err.error || `Server error ${res.status}`);
  }
  return res.json();
}

export async function apiCheckVeoStatus(operationName: string): Promise<{ done: boolean; error?: any }> {
  const res = await fetch('/api/video-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Status check failed' }));
    throw new Error(err.error || `Server error ${res.status}`);
  }
  return res.json();
}

export async function apiDownloadVeoVideo(operationName: string): Promise<string> {
  const res = await fetch('/api/video-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName })
  });
  if (!res.ok) {
    throw new Error('Failed to download video stream');
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function apiVoiceAssist(text: string, voiceName?: string): Promise<string | null> {
  try {
    const res = await fetch('/api/voice-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceName })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.audio || null;
  } catch (e) {
    console.error('Voice assist error:', e);
    return null;
  }
}


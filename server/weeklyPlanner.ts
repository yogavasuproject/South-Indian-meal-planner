import { GoogleGenAI } from '@google/genai';
import { DailyMenu, UserPreferences, WeeklyPlan, DayPlan } from '../src/types/meal';
import { CURATED_MENUS, DISH_CATALOG } from '../src/services/southIndianDatabase';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export async function generateWeeklyPlan(preferences: UserPreferences): Promise<WeeklyPlan> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({});
      const prompt = `Generate a culturally authentic 7-Day South Indian Weekly Meal Plan (Monday to Sunday) for ${preferences.servings} people.
Cuisine: ${preferences.cuisine} | Diet: ${preferences.dietType} | Spice: ${preferences.spice} | Budget: ${preferences.budget}
Strict Household Rules:
1. MAXIMIZE VARIETY: Never repeat the same main gravy two days consecutively. Balance Sambar, Vatha Kuzhambu, Mor Kuzhambu, Kootu, Rasam varieties (Tomato, Pepper, Lemon, Garlic), and greens (Keerai).
2. Tiffin variety: Rotate Idli, Dosa varieties, Ven Pongal, Upma, Ragi Dosa, Poori, Paniyaram, Adai.
3. Light dinner philosophy.
4. Smart batching across the week.

Return raw JSON with:
{
  "id": "weekly-${Date.now()}",
  "title": "Balanced South Indian 7-Day Plan",
  "createdAt": "${new Date().toISOString()}",
  "days": [
    {
      "dayName": "Monday",
      "menu": {
        "title": "Menu Name",
        "theme": "Theme",
        "breakfast": { "title": "...", "highlights": [], "dishes": [...] },
        "lunch": { "title": "...", "highlights": [], "dishes": [...] },
        "snack": { "title": "...", "highlights": [], "dishes": [...] },
        "dinner": { "title": "...", "highlights": [], "dishes": [...] },
        "totalCookingTime": "1 hr",
        "estimatedCost": "₹200",
        "ingredientReuse": []
      }
    },
    ... (continue for Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
  ],
  "weeklyShoppingList": [
    {
      "category": "Vegetables",
      "items": [{"name": "Item", "quantity": "Quantity", "haveAtHome": false}]
    },
    {
      "category": "Grains / Staples",
      "items": [...]
    },
    {
      "category": "Pulses",
      "items": [...]
    },
    {
      "category": "Dairy / Fats & Other",
      "items": [...]
    }
  ]
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });

      const parsed = JSON.parse(res.text?.trim() || '{}');
      if (parsed.days && parsed.days.length === 7) {
        return parsed as WeeklyPlan;
      }
    } catch (err) {
      console.error('Gemini weekly generation fallback:', err);
    }
  }

  // Curated 7-day fallback plan with strict culinary variety
  const weeklyDays: DayPlan[] = DAYS_OF_WEEK.map((dayName, idx) => {
    let baseMenu = CURATED_MENUS[idx % CURATED_MENUS.length];
    const cloned = JSON.parse(JSON.stringify(baseMenu)) as DailyMenu;
    cloned.id = `day-${idx}-${Date.now()}`;
    cloned.dayName = dayName;

    // Introduce day-specific variety
    if (dayName === 'Monday') {
      cloned.title = 'Fresh Start: Ven Pongal & Drumstick Sambar';
      cloned.theme = 'Comforting & Nourishing';
    } else if (dayName === 'Tuesday') {
      cloned.title = 'Tangy Midweek: Sundakkai Vatha Kuzhambu & Potato Roast';
      cloned.theme = 'Tamarind Infused';
    } else if (dayName === 'Wednesday') {
      cloned.title = 'Soothing Mor Kuzhambu & Keerai Poriyal';
      cloned.theme = 'Gut-Friendly Probiotic';
    } else if (dayName === 'Thursday') {
      cloned.title = 'High-Protein Adai Aviyal & Tomato Rasam';
      cloned.theme = 'Protein-Rich Pulses';
    } else if (dayName === 'Friday') {
      cloned.title = 'Traditional Sukravaaram Sambar & Paruppu Payasam';
      cloned.theme = 'Auspicious Friday Flavors';
    } else if (dayName === 'Saturday') {
      cloned.title = 'Crisp Ragi Dosa & Chettinad Veg Kurma';
      cloned.theme = 'Millet & Whole Grain';
    } else if (dayName === 'Sunday') {
      cloned.title = preferences.dietType === 'non-veg' 
        ? 'Grand Sunday Chettinad Chicken Feast' 
        : 'Grand Sunday Poori Masala & Special Lunch Virundhu';
      cloned.theme = 'Weekend Celebration';
    }

    return {
      dayName,
      menu: cloned
    };
  });

  return {
    id: `weekly-${Date.now()}`,
    title: 'Balanced South Indian 7-Day Household Plan',
    createdAt: new Date().toISOString(),
    days: weeklyDays,
    weeklyShoppingList: [
      {
        category: 'Vegetables',
        items: [
          { name: 'Country Tomatoes', quantity: '2 kg', haveAtHome: false },
          { name: 'Shallots (Sambar Onions)', quantity: '1 kg', haveAtHome: false },
          { name: 'Red Onions', quantity: '2 kg', haveAtHome: false },
          { name: 'Potatoes', quantity: '1.5 kg', haveAtHome: false },
          { name: 'French Beans', quantity: '500g', haveAtHome: false },
          { name: 'Drumsticks', quantity: '4 sticks', haveAtHome: false },
          { name: 'Spinach / Keerai', quantity: '2 bunches', haveAtHome: false },
          { name: 'Curry leaves & Coriander', quantity: '3 bunches', haveAtHome: false },
          { name: 'Ginger & Garlic', quantity: '250g each', haveAtHome: false }
        ]
      },
      {
        category: 'Grains / Staples',
        items: [
          { name: 'Ponni Rice / Sona Masoori', quantity: '5 kg', haveAtHome: false },
          { name: 'Whole Wheat Atta', quantity: '2 kg', haveAtHome: false },
          { name: 'Ragi Flour', quantity: '1 kg', haveAtHome: false },
          { name: 'Idli/Dosa Batter', quantity: '3 kg (split batches)', haveAtHome: false }
        ]
      },
      {
        category: 'Pulses',
        items: [
          { name: 'Toor Dal', quantity: '1 kg', haveAtHome: false },
          { name: 'Yellow Moong Dal', quantity: '500g', haveAtHome: false },
          { name: 'Chana Dal', quantity: '500g', haveAtHome: false },
          { name: 'Urad Dal', quantity: '500g', haveAtHome: false }
        ]
      },
      {
        category: 'Dairy / Fats & Other',
        items: [
          { name: 'Fresh Coconuts', quantity: '4 nuts', haveAtHome: false },
          { name: 'Pure Sesame / Gingelly Oil', quantity: '1 liter', haveAtHome: false },
          { name: 'Pure Cow Ghee', quantity: '250g', haveAtHome: false },
          { name: 'Tamarind', quantity: '500g', haveAtHome: false },
          { name: 'Sundakkai Vathal', quantity: '100g', haveAtHome: false }
        ]
      }
    ]
  };
}

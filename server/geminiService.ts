import { GoogleGenAI, GenerateVideosOperation, Modality } from '@google/genai';
import { DailyMenu, UserPreferences } from '../src/types/meal';
import { CURATED_MENUS } from '../src/services/southIndianDatabase';

let aiInstance: GoogleGenAI | null = null;

export function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function generateDailyMenuWithGemini(
  preferences: UserPreferences,
  overridePrompt?: string,
  previousMenu?: Partial<DailyMenu> | null
): Promise<DailyMenu> {
  const ai = getAI();
  if (!ai) {
    console.log('No GEMINI_API_KEY provided; using high-fidelity South Indian knowledge engine.');
    return generateFallbackMenu(preferences, overridePrompt, previousMenu);
  }

  const systemInstruction = `You are "Enna Samayal?", an expert South Indian grandmother and household cooking planner.
You understand authentic home cooking across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, and Telangana, with deep specialty in Tamil everyday home food.
CRITICAL COOKING PHILOSOPHY:
1. NEVER generate isolated, random restaurant dishes. Generate COMPLETE, COMPLEMENTARY household meals.
2. Lunch meal harmony:
   - If main kuzhambu is tamarind-heavy/spicy (like Vatha Kuzhambu or Kara Kuzhambu or Meen Kuzhambu), pair with a mild vegetable kootu or potato roast or poriyal, plus rasam and curd to balance the palate. NEVER pair two heavy tamarind curries.
   - If main is Sambar, pair with a crisp poriyal (beans/carrot/cabbage) and rasam.
   - If Mor Kuzhambu (yogurt based), pair with spicy potato roast or seppankizhangu roast or vathal.
3. Breakfast & Dinner lightness:
   - Dinner should typically be lighter and practical (Dosa, Idli, Chapati, Paniyaram, Ragi Dosa, Adai) unless requested otherwise.
4. Smart Ingredient Reuse:
   - Identify common ingredients (e.g. coconut, dal, potatoes, onions) and share prep work across meals to eliminate waste.
5. Cooking Workflow:
   - Provide realistic, time-sequenced preparation steps (e.g. 7:15 AM morning tiffin, 11:15 AM lunch batching, 4:30 PM tea snack, 7:30 PM dinner).
6. Non-Repetition:
   - If a previous menu or yesterday's meal is provided, AVOID repeating the primary dishes (e.g. do not suggest Sambar if yesterday had Sambar; do not suggest Dosa if yesterday had Dosa).
7. Dietary & Ingredient rules:
   - Strongly respect available ingredients (use them!), avoid ingredients (NEVER use them!), and dietary restrictions (e.g. diabetic friendly -> use millets, ragi, green leafy vegetables, less white polished rice).
8. Return strictly valid JSON following the provided schema. No markdown formatting outside JSON.`;

  const prompt = `Generate a complete South Indian daily meal plan for today with these constraints:
- Servings: ${preferences.servings} people
- Cuisine Style: ${preferences.cuisine}
- Dietary Preference: ${preferences.dietType}
- Spice Level: ${preferences.spice}
- Available Cooking Time: ${preferences.cookingTime}
- Budget: ${preferences.budget}
- Available Ingredients to prioritize: ${preferences.availableIngredients.length > 0 ? preferences.availableIngredients.join(', ') : 'Standard South Indian pantry'}
- Ingredients to Strictly Avoid: ${preferences.avoidIngredients.length > 0 ? preferences.avoidIngredients.join(', ') : 'None'}
- Dietary Restrictions: ${preferences.dietaryRestrictions.length > 0 ? preferences.dietaryRestrictions.join(', ') : 'None'}
- Specific Breakfast Preference: ${preferences.breakfastPref || 'Any authentic combination'}
- Specific Lunch Preference: ${preferences.lunchPref || 'Any authentic combination'}
- Specific Dinner Preference: ${preferences.dinnerPref || 'Any authentic combination'}
${overridePrompt ? `- User Override / Special Request: "${overridePrompt}"` : ''}
${previousMenu ? `- YESTERDAY'S / PREVIOUS MENU TO AVOID REPEATING: Breakfast was "${previousMenu.breakfast?.title}", Lunch was "${previousMenu.lunch?.title}", Dinner was "${previousMenu.dinner?.title}". Ensure fresh variety today!` : ''}

Format your response as a single raw JSON object with keys:
{
  "id": "menu-${Date.now()}",
  "date": "${new Date().toISOString().split('T')[0]}",
  "dayName": "Today",
  "title": "Creative culturally authentic name (e.g., 'Aadi Sukravaara Virundhu' or 'Light Healthy Millet & Keerai Day')",
  "theme": "Short 3-5 word summary of the culinary focus",
  "servings": ${preferences.servings},
  "cuisine": "${preferences.cuisine}",
  "dietType": "${preferences.dietType}",
  "totalCookingTime": "Total active cooking time across all meals (e.g., '1 hr 10 mins')",
  "estimatedCost": "Realistic total ingredient cost in INR for ${preferences.servings} people (e.g., '₹180 - ₹240')",
  "breakfast": {
    "type": "breakfast",
    "title": "Main dish & chutney/sambar",
    "highlights": ["highlight 1", "highlight 2"],
    "dishes": [
      {
        "id": "dish-id-1",
        "name": "English Dish Name",
        "tamilName": "Tamil script name",
        "category": "Tiffin or Main or Chutney or Kuzhambu",
        "description": "Appetizing 1-line description",
        "prepTime": "X mins",
        "cookTime": "Y mins",
        "servings": ${preferences.servings},
        "isVegetarian": true or false,
        "ingredients": [
          {"name": "Ingredient name", "quantity": "Scaled quantity for ${preferences.servings} people", "category": "Vegetables or Grains / Staples or Pulses or Dairy / Fats or Spices & Condiments or Meat / Seafood or Other"}
        ],
        "steps": ["Step 1...", "Step 2...", "Step 3..."],
        "tips": "Practical home cooking secret",
        "substitutions": "Alternative ingredient"
      }
    ]
  },
  "lunch": { ...same structure with Steamed Rice/Millet, main Kuzhambu/Sambar, side Poriyal, Rasam, Curd/accompaniments... },
  "snack": { ...same structure for authentic 4:30 PM snack & tea/coffee... },
  "dinner": { ...same structure for light evening meal... },
  "ingredientReuse": [
    {"ingredient": "Name", "usedIn": ["Dish A", "Dish B"], "tip": "Practical multi-meal time/cost saving tip"}
  ],
  "preparationPlan": [
    {"time": "7:15 AM", "phase": "Morning Prep", "tasks": ["Task 1", "Task 2"]},
    {"time": "11:15 AM", "phase": "Lunch Prep", "tasks": ["Task 1", "Task 2"]},
    {"time": "4:30 PM", "phase": "Tea Time", "tasks": ["Task 1"]},
    {"time": "7:45 PM", "phase": "Dinner Prep", "tasks": ["Task 1", "Task 2"]}
  ],
  "shoppingList": [
    {
      "category": "Vegetables",
      "items": [{"name": "Item name", "quantity": "Quantity", "haveAtHome": false}]
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(responseText) as DailyMenu;
    // Mark items that are in user's availableIngredients as haveAtHome: true
    if (parsed.shoppingList && preferences.availableIngredients?.length > 0) {
      const availLower = preferences.availableIngredients.map(i => i.toLowerCase().trim());
      parsed.shoppingList.forEach(cat => {
        cat.items.forEach(item => {
          if (availLower.some(a => item.name.toLowerCase().includes(a) || a.includes(item.name.toLowerCase()))) {
            item.haveAtHome = true;
          }
        });
      });
    }

    return parsed;
  } catch (error) {
    console.error('Gemini menu generation error, falling back to intelligent knowledge base:', error);
    return generateFallbackMenu(preferences, overridePrompt, previousMenu);
  }
}

export async function swapMealSlotWithGemini(
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  currentMenu: DailyMenu,
  preferences: UserPreferences,
  customRequest?: string
): Promise<DailyMenu> {
  const ai = getAI();
  if (!ai) {
    return swapMealFallback(mealType, currentMenu, preferences);
  }

  const prompt = `You are a South Indian home cooking assistant. The user wants to change ONLY the ${mealType.toUpperCase()} of their daily menu.
Current full menu context:
- Breakfast: ${currentMenu.breakfast.title}
- Lunch: ${currentMenu.lunch.title}
- Dinner: ${currentMenu.dinner.title}
- Diet: ${currentMenu.dietType}
- Servings: ${currentMenu.servings}
- Cuisine: ${currentMenu.cuisine}
${customRequest ? `- User specific requirement for new ${mealType}: "${customRequest}"` : ''}

Generate an alternative, complementary South Indian ${mealType} that does not clash with the other meals of the day.
Return strictly a raw JSON object matching the MealSlot schema:
{
  "type": "${mealType}",
  "title": "Dish name & accompaniment",
  "highlights": ["reason 1", "reason 2"],
  "dishes": [
    {
      "id": "new-${mealType}-dish-1",
      "name": "Dish Name",
      "tamilName": "Tamil name",
      "category": "Main / Tiffin / Chutney / Kuzhambu / etc",
      "description": "Description",
      "prepTime": "X mins",
      "cookTime": "Y mins",
      "servings": ${currentMenu.servings},
      "isVegetarian": true or false,
      "ingredients": [
        {"name": "Ingredient", "quantity": "amount", "category": "Vegetables or Grains / Staples or Pulses or Dairy / Fats or Spices & Condiments"}
      ],
      "steps": ["Step 1", "Step 2"],
      "tips": "Tip",
      "substitutions": "Substitution"
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8
      }
    });

    const parsedSlot = JSON.parse(response.text?.trim() || '{}');
    if (parsedSlot && parsedSlot.dishes) {
      return {
        ...currentMenu,
        [mealType]: parsedSlot
      };
    }
    return swapMealFallback(mealType, currentMenu, preferences);
  } catch (err) {
    console.error('Swap meal error, using fallback:', err);
    return swapMealFallback(mealType, currentMenu, preferences);
  }
}

// Knowledge-engine fallbacks for resilient offline execution
function generateFallbackMenu(
  preferences: UserPreferences,
  overridePrompt?: string,
  previousMenu?: Partial<DailyMenu> | null
): DailyMenu {
  // Pick from curated database or synthesize based on preferences
  let selected = CURATED_MENUS[0];

  if (preferences.dietType === 'non-veg') {
    selected = CURATED_MENUS[2] || CURATED_MENUS[0];
  } else if (preferences.cookingTime === 'under-30' || preferences.budget === 'economy') {
    selected = CURATED_MENUS[1] || CURATED_MENUS[0];
  } else if (previousMenu && previousMenu.id === CURATED_MENUS[0].id) {
    selected = CURATED_MENUS[1];
  }

  // Deep clone
  const cloned: DailyMenu = JSON.parse(JSON.stringify(selected));
  cloned.id = `menu-${Date.now()}`;
  cloned.servings = preferences.servings;
  cloned.cuisine = preferences.cuisine;
  cloned.dietType = preferences.dietType;

  // If user has specific available ingredients, prioritize them
  if (preferences.availableIngredients.length > 0) {
    const avail = preferences.availableIngredients.join(', ');
    cloned.theme = `Pantry Optimized: Utilizing ${avail}`;
    // Update shopping list to reflect what they have at home
    const availLower = preferences.availableIngredients.map(i => i.toLowerCase().trim());
    cloned.shoppingList.forEach(cat => {
      cat.items.forEach(item => {
        if (availLower.some(a => item.name.toLowerCase().includes(a) || a.includes(item.name.toLowerCase()))) {
          item.haveAtHome = true;
        }
      });
    });
  }

  if (overridePrompt) {
    cloned.title = `${cloned.title} (${overridePrompt})`;
  }

  return cloned;
}

function swapMealFallback(
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  currentMenu: DailyMenu,
  preferences: UserPreferences
): DailyMenu {
  const cloned: DailyMenu = JSON.parse(JSON.stringify(currentMenu));
  const alternativeIndex = (CURATED_MENUS.findIndex(m => m.id === currentMenu.id) + 1) % CURATED_MENUS.length;
  const alt = CURATED_MENUS[alternativeIndex] || CURATED_MENUS[0];

  cloned[mealType] = JSON.parse(JSON.stringify(alt[mealType]));
  return cloned;
}

// ----------------------------------------------------
// AI CHATBOT FUNCTIONALITY
// Models: gemini-3.1-pro-preview (complex reasoning),
//         gemini-3.5-flash (general tasks),
//         gemini-3.1-flash-lite (fast tasks)
// ----------------------------------------------------
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export async function chatWithGemini(
  messages: ChatMessage[],
  systemInstruction?: string,
  modelName: string = 'gemini-3.5-flash',
  menuContext?: string
): Promise<{ reply: string; modelUsed: string }> {
  const ai = getAI();
  const validModels = ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
  const modelToUse = validModels.includes(modelName) ? modelName : 'gemini-3.5-flash';

  const defaultSystem = `You are a warm, deeply knowledgeable South Indian culinary mentor.
You specialize in home-style Tamil Nadu, Kerala, Karnataka, Andhra & Telangana cuisines.
You provide practical cooking advice, Kaipakuva (hand-touch secrets), spice ratios, rescue tips (e.g. if a dish is too salty, watery, or sour), and healthy modifications.
Keep responses engaging, culturally authentic, and helpful for home cooks.`;

  const finalSystemInstruction = `${defaultSystem}\n${systemInstruction || ''}${
    menuContext ? `\n\nCURRENT USER MEAL CONTEXT TODAY:\n${menuContext}` : ''
  }`;

  if (!ai) {
    // Graceful smart fallback when no API key configured
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    return {
      reply: `[Demo Mode / Knowledge Base] Regarding "${lastUserMsg}": In South Indian home cooking, balance is everything. If a curry is too sour, balance it with a pinch of jaggery or a splash of water and a quick boil. If Sambar is too watery, dissolve 1 tsp of besan (gram flour) or rice flour in 2 tbsp water and boil for 2 minutes to bring instant silky thickness! Add your Gemini API key in Settings > Secrets for full live AI responses.`,
      modelUsed: modelToUse
    };
  }

  // Format messages for @google/genai
  const formattedContents = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: formattedContents,
      config: {
        systemInstruction: finalSystemInstruction,
        temperature: 0.7,
      }
    });

    return {
      reply: response.text || 'Paati nods thoughtfully: Try adjusting salt and curry leaves!',
      modelUsed: modelToUse
    };
  } catch (err: any) {
    console.error(`Error with model ${modelToUse}:`, err);
    // If higher model failed, try fast fallback
    if (modelToUse !== 'gemini-3.5-flash') {
      try {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: formattedContents,
          config: { systemInstruction: finalSystemInstruction }
        });
        return {
          reply: fallbackRes.text || 'Here is the chef advice for your dish.',
          modelUsed: 'gemini-3.5-flash (fallback)'
        };
      } catch (e) {
        throw err;
      }
    }
    throw err;
  }
}

// ----------------------------------------------------
// AI IMAGE GENERATION & EDITING
// Model: gemini-3.1-flash-image-preview
// ----------------------------------------------------
export async function generateOrEditImageWithGemini(
  prompt: string,
  aspectRatio: string = '1:1',
  baseImageBase64?: string,
  mimeType: string = 'image/jpeg'
): Promise<{ imageUrl: string; description?: string }> {
  const ai = getAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is required to generate or edit food images.');
  }

  const parts: any[] = [];
  if (baseImageBase64) {
    // Clean base64 prefix if present
    const cleanBase64 = baseImageBase64.replace(/^data:image\/\w+;base64,/, '');
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType || 'image/jpeg',
      },
    });
  }
  parts.push({ text: prompt });

  const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  const ratio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

  try {
    // Try primary model gemini-3.1-flash-image-preview as requested
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: ratio as any,
        }
      }
    });

    let foundImageUrl: string | null = null;
    let foundText = '';

    const candidates = response.candidates || [];
    for (const cand of candidates) {
      for (const part of cand.content?.parts || []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          foundImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          foundText += part.text + ' ';
        }
      }
    }

    if (!foundImageUrl) {
      throw new Error(foundText || 'No image was returned from the model.');
    }

    return {
      imageUrl: foundImageUrl,
      description: foundText.trim()
    };
  } catch (primaryErr: any) {
    console.warn('gemini-3.1-flash-image-preview error, attempting with gemini-3.1-flash-image:', primaryErr.message);
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: ratio as any,
          }
        }
      });
      for (const cand of fallbackResponse.candidates || []) {
        for (const part of cand.content?.parts || []) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            return {
              imageUrl: `data:${mime};base64,${part.inlineData.data}`,
              description: part.text
            };
          }
        }
      }
      throw primaryErr;
    } catch (fbErr) {
      throw primaryErr;
    }
  }
}

// ----------------------------------------------------
// VEO VIDEO GENERATION (ANIMATE IMAGE INTO VIDEO)
// Model: veo-3.1-fast-generate-preview
// Aspect ratio: 16:9 or 9:16
// ----------------------------------------------------
export async function startVeoVideoGeneration(
  prompt: string,
  aspectRatio: '16:9' | '9:16' = '16:9',
  imageBase64?: string,
  mimeType: string = 'image/png'
): Promise<{ operationName: string }> {
  const ai = getAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is required to generate Veo videos.');
  }

  const payload: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || 'Steam rising gently from hot fresh South Indian food, appetizing movement, warm kitchen ambient lighting',
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
    }
  };

  if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    payload.image = {
      imageBytes: cleanBase64,
      mimeType: mimeType || 'image/png',
    };
  }

  try {
    const operation = await ai.models.generateVideos(payload);
    if (!operation.name) {
      throw new Error('Video generation operation did not return an operation name');
    }
    return { operationName: operation.name };
  } catch (err: any) {
    console.error('Failed to start Veo video generation:', err);
    throw err;
  }
}

export async function checkVeoVideoStatus(operationName: string): Promise<{ done: boolean; error?: any }> {
  const ai = getAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is required');
  }

  const op = new GenerateVideosOperation();
  op.name = operationName;
  const updated = await ai.operations.getVideosOperation({ operation: op });
  return {
    done: !!updated.done,
    error: updated.error
  };
}

export async function getVeoVideoDownloadStream(operationName: string): Promise<{ stream: any; contentType: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = getAI();
  if (!ai || !apiKey) {
    throw new Error('GEMINI_API_KEY is required');
  }

  const op = new GenerateVideosOperation();
  op.name = operationName;
  const updated = await ai.operations.getVideosOperation({ operation: op });
  const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
  if (!uri) {
    throw new Error('Video URI not found in completed operation');
  }

  const videoRes = await fetch(uri, {
    headers: { 'x-goog-api-key': apiKey },
  });

  if (!videoRes.ok) {
    throw new Error(`Failed to download video from storage: ${videoRes.statusText}`);
  }

  return {
    stream: videoRes.body,
    contentType: 'video/mp4'
  };
}

// ----------------------------------------------------
// VOICE SYNTHESIS (TTS FALLBACK / PLAYBACK)
// Model: gemini-3.8-flash-lite-tts
// ----------------------------------------------------
export async function synthesizeVoiceAudio(text: string, voiceName: string = 'Kore'): Promise<string | null> {
  const ai = getAI();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style: 'Warm, friendly South Indian home cooking advisor',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: (voiceName as any) || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (err) {
    console.error('TTS synthesis error:', err);
    return null;
  }
}


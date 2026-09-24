export type DietType = 'veg' | 'non-veg' | 'egg' | 'mixed';
export type CuisineStyle = 'tamil' | 'kerala' | 'karnataka' | 'andhra' | 'telangana' | 'mixed';
export type SpiceLevel = 'mild' | 'medium' | 'spicy';
export type CookingTimeOption = 'under-30' | '30-60' | '60-90' | 'flexible';
export type BudgetOption = 'economy' | 'regular' | 'flexible';

export interface Ingredient {
  name: string;
  quantity: string;
  category: 'Vegetables' | 'Grains / Staples' | 'Pulses' | 'Dairy / Fats' | 'Spices & Condiments' | 'Meat / Seafood' | 'Other';
  notes?: string;
  haveAtHome?: boolean;
}

export interface Dish {
  id: string;
  name: string;
  tamilName?: string;
  category: 'Main' | 'Side' | 'Kuzhambu' | 'Sambar' | 'Rasam' | 'Kootu' | 'Poriyal' | 'Tiffin' | 'Snack' | 'Chutney' | 'Beverage' | 'Accompaniment';
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  tips?: string;
  substitutions?: string;
  storage?: string;
  isVegetarian: boolean;
  isQuick?: boolean;
}

export interface MealSlot {
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  title: string;
  description?: string;
  dishes: Dish[];
  highlights?: string[];
}

export interface IngredientReuse {
  ingredient: string;
  usedIn: string[];
  tip: string;
}

export interface WorkflowTask {
  time: string;
  phase: string;
  tasks: string[];
}

export interface DailyMenu {
  id: string;
  date: string;
  dayName: string;
  title: string;
  theme: string;
  servings: number;
  cuisine: CuisineStyle;
  dietType: DietType;
  totalCookingTime: string;
  estimatedCost: string;
  breakfast: MealSlot;
  lunch: MealSlot;
  snack: MealSlot;
  dinner: MealSlot;
  ingredientReuse: IngredientReuse[];
  preparationPlan: WorkflowTask[];
  shoppingList: {
    category: string;
    items: {
      name: string;
      quantity: string;
      haveAtHome: boolean;
      checked?: boolean;
    }[];
  }[];
  notes?: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface UserPreferences {
  servings: number;
  dietType: DietType;
  cuisine: CuisineStyle;
  spice: SpiceLevel;
  cookingTime: CookingTimeOption;
  budget: BudgetOption;
  dietaryRestrictions: string[];
  availableIngredients: string[];
  avoidIngredients: string[];
  breakfastPref: string;
  lunchPref: string;
  dinnerPref: string;
}

export interface DayPlan {
  dayName: string;
  dateStr?: string;
  menu: DailyMenu;
}

export interface WeeklyPlan {
  id: string;
  title: string;
  createdAt: string;
  days: DayPlan[];
  weeklyShoppingList: {
    category: string;
    items: {
      name: string;
      quantity: string;
      haveAtHome: boolean;
      checked?: boolean;
    }[];
  }[];
}

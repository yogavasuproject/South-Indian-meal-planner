import { DailyMenu, Dish, MealSlot, UserPreferences, IngredientReuse, WorkflowTask, CuisineStyle, DietType } from '../types/meal';

export const POPULAR_AVAILABLE_INGREDIENTS = [
  'Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Beans', 'Coconut', 
  'Curry Leaves', 'Coriander Leaves', 'Green Chillies', 'Ginger', 'Garlic', 
  'Mustard Seeds', 'Cumin Seeds', 'Toor Dal', 'Moong Dal', 'Urad Dal', 
  'Rice', 'Idli Batter', 'Eggs', 'Chicken', 'Fish', 'Tamarind', 'Curd', 'Ghee'
];

export const COMMON_AVOID_INGREDIENTS = [
  'Garlic', 'Onion', 'Eggplant (Brinjal)', 'Bitter Gourd', 'Coconut', 'Peanuts', 'Dairy', 'Gluten', 'Excess Oil'
];

export const DIETARY_OPTIONS = [
  'None',
  'Diabetic-Friendly',
  'Low-Oil & Heart-Healthy',
  'High-Protein',
  'Gluten-Free',
  'No Onion / No Garlic (Sattvic)',
  'Weight-Watchers (Light)'
];

// Curated authentic South Indian dishes with scalable ingredients & realistic home steps
export const DISH_CATALOG: Record<string, Dish> = {
  // Breakfast items
  'ven-pongal': {
    id: 'ven-pongal',
    name: 'Ven Pongal',
    tamilName: 'வெண் பொங்கல்',
    category: 'Tiffin',
    description: 'Silky, comforting rice and moong dal tempered with ghee, crushed black pepper, cumin seeds, ginger, and crunchy cashews.',
    prepTime: '5 mins',
    cookTime: '20 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Raw Rice / Millets', quantity: '1 cup (200g)', category: 'Grains / Staples' },
      { name: 'Yellow Moong Dal', quantity: '1/2 cup (100g)', category: 'Pulses' },
      { name: 'Ghee', quantity: '2 tbsp', category: 'Dairy / Fats' },
      { name: 'Black Peppercorns & Cumin', quantity: '1 tsp each', category: 'Spices & Condiments' },
      { name: 'Ginger (grated)', quantity: '1 inch', category: 'Vegetables' },
      { name: 'Cashews & Curry Leaves', quantity: '10 cashews + 1 sprig', category: 'Spices & Condiments' }
    ],
    steps: [
      'Lightly dry roast moong dal until warm and fragrant (do not brown).',
      'Wash rice and dal together. Add 4 cups of water and salt, pressure cook for 4-5 whistles until soft and mushy.',
      'In a tadka pan, heat ghee. Fry cashews until golden, then add cumin seeds, crushed black pepper, chopped ginger, and curry leaves.',
      'Pour the fragrant sizzling tempering over the mashed pongal and mix thoroughly with a ladle.'
    ],
    tips: 'If pongal sits and thickens, stir in 1/4 cup of boiling hot water and a small spoonful of ghee.',
    substitutions: 'Replace raw rice with Foxtail Millet (Thinai) or Kodo Millet (Varagu) for diabetic meal plans.'
  },

  'coconut-chutney': {
    id: 'coconut-chutney',
    name: 'Fresh Coconut Chutney',
    tamilName: 'தேங்காய் சட்னி',
    category: 'Chutney',
    description: 'Quintessential white coconut chutney with roasted gram, green chillies, and mustard-curry leaf tadka.',
    prepTime: '5 mins',
    cookTime: '2 mins',
    servings: 4,
    isVegetarian: true,
    isQuick: true,
    ingredients: [
      { name: 'Fresh Grated Coconut', quantity: '1 cup', category: 'Other' },
      { name: 'Roasted Gram (Pottukadalai)', quantity: '2 tbsp', category: 'Pulses' },
      { name: 'Green Chillies', quantity: '2', category: 'Vegetables' },
      { name: 'Ginger', quantity: '1/2 inch', category: 'Vegetables' },
      { name: 'Mustard Seeds & Curry Leaves', quantity: '1/2 tsp + 1 sprig', category: 'Spices & Condiments' },
      { name: 'Sesame / Coconut Oil', quantity: '1 tsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Grind grated coconut, roasted gram, green chillies, ginger, salt, and 1/3 cup water into a smooth paste.',
      'Heat oil in a small pan, crackle mustard seeds, add curry leaves and a pinch of asafoetida (hing).',
      'Pour tadka over chutney and gently stir.'
    ],
    tips: 'Do not over-grind coconut on high speed to avoid extracting coconut oil.',
    substitutions: 'Add a small handful of fresh coriander or mint leaves for variant herbal flavor.'
  },

  'tiffin-sambar': {
    id: 'tiffin-sambar',
    name: 'Hotel Style Tiffin Sambar',
    tamilName: 'டிபன் சாம்பார்',
    category: 'Kuzhambu',
    description: 'Aromatic, slightly sweet-tangy lentil stew with shallots, tomatoes, and freshly roasted spice powder.',
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Toor Dal / Moong Dal', quantity: '1/2 cup', category: 'Pulses' },
      { name: 'Shallots (Small Onions)', quantity: '10-12 peeled', category: 'Vegetables' },
      { name: 'Tomato', quantity: '1 chopped', category: 'Vegetables' },
      { name: 'Tamarind Paste', quantity: '1 tsp', category: 'Spices & Condiments' },
      { name: 'Sambar Powder & Turmeric', quantity: '1.5 tsp + 1/4 tsp', category: 'Spices & Condiments' },
      { name: 'Jaggery', quantity: 'small pinch', category: 'Spices & Condiments' }
    ],
    steps: [
      'Pressure cook toor dal with turmeric until completely soft; whisk until smooth.',
      'Sauté shallots and tomatoes in 1 tsp oil, add tamarind extract, sambar powder, and salt. Simmer 6 minutes until raw smell goes.',
      'Pour in mashed dal, adjust consistency with water, and simmer for 3 minutes.',
      'Temper with mustard seeds, dry red chilli, hing, and fresh curry leaves.'
    ]
  },

  'idli': {
    id: 'idli',
    name: 'Soft Mallipoo Idlis',
    tamilName: 'மல்லிப்பூ இட்லி',
    category: 'Tiffin',
    description: 'Pillow-soft, steamed fermented rice and black gram lentil cakes.',
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: 4,
    isVegetarian: true,
    isQuick: true,
    ingredients: [
      { name: 'Fermented Idli Batter', quantity: '4 cups', category: 'Grains / Staples' },
      { name: 'Sesame Oil (for greasing)', quantity: '1 tsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Grease idli plates lightly with sesame oil.',
      'Gently mix fermented batter; ladle into moulds without over-mixing.',
      'Steam in idli cooker or steamer on medium-high heat for 8-10 minutes.',
      'Rest for 2 minutes, sprinkle wet water on spatula edge, and scoop out effortlessly.'
    ]
  },

  'crispy-dosa': {
    id: 'crispy-dosa',
    name: 'Crispy Roast Dosa',
    tamilName: 'ரோஸ்ட் தோசை',
    category: 'Tiffin',
    description: 'Crisp golden crepe made from fermented batter, roasted with aromatic sesame oil or ghee.',
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Dosa / Idli Batter', quantity: '3.5 cups', category: 'Grains / Staples' },
      { name: 'Ghee or Sesame Oil', quantity: '2 tbsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Heat cast-iron tawa until water sizzles and evaporates.',
      'Pour a ladle of batter into the center, spread in continuous spirals from center outwards.',
      'Drizzle 1/2 tsp ghee/oil along edges and center. Roast on medium flame until golden crisp.'
    ]
  },

  'ragi-dosa': {
    id: 'ragi-dosa',
    name: 'Instant Healthy Ragi Dosa',
    tamilName: 'கேழ்வரகு தோசை',
    category: 'Tiffin',
    description: 'Nutritious finger millet crepe packed with calcium and dietary fiber, seasoned with cumin and curry leaves.',
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Ragi Flour (Finger Millet)', quantity: '1.5 cups', category: 'Grains / Staples' },
      { name: 'Rice Flour', quantity: '1/2 cup', category: 'Grains / Staples' },
      { name: 'Curd (Yogurt)', quantity: '1/4 cup', category: 'Dairy / Fats' },
      { name: 'Onion (finely chopped)', quantity: '1 medium', category: 'Vegetables' },
      { name: 'Cumin seeds & Green Chilli', quantity: '1 tsp + 1 chilli', category: 'Spices & Condiments' }
    ],
    steps: [
      'Whisk ragi flour, rice flour, curd, salt, and 2.5 cups water into a thin, rava-dosa-like pouring consistency.',
      'Stir in finely chopped onions, crushed cumin, and green chillies. Rest for 10 minutes.',
      'Pour batter from height onto a smoking hot tawa, starting from outer rim to center.',
      'Cook on medium heat until edges lift and turn crispy.'
    ],
    tips: 'Ideal for diabetic and low-cholesterol diets without fermentation wait.'
  },

  'poori-masala': {
    id: 'poori-masala',
    name: 'Puffy Poori with Potato Masala',
    tamilName: 'பூரி & உருளைக்கிழங்கு மசால்',
    category: 'Tiffin',
    description: 'Crisp puffed whole-wheat pooris served with authentic yellow South Indian spiced potato onion gravy.',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Atta (Whole Wheat Flour)', quantity: '2 cups', category: 'Grains / Staples' },
      { name: 'Potatoes (boiled & mashed)', quantity: '3 large (300g)', category: 'Vegetables' },
      { name: 'Onions (sliced)', quantity: '2 medium', category: 'Vegetables' },
      { name: 'Gram Flour (Besan)', quantity: '1 tbsp dissolved in water', category: 'Pulses' },
      { name: 'Ginger & Green Chillies', quantity: '1 tbsp minced', category: 'Vegetables' },
      { name: 'Turmeric & Mustard seeds', quantity: '1/2 tsp each', category: 'Spices & Condiments' },
      { name: 'Cooking Oil', quantity: 'for deep frying + 1 tbsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Knead atta with water and salt into a stiff dough. Rest 10 mins, roll into 4-inch discs.',
      'For masala: temper mustard, urad dal, ginger, green chillies and curry leaves. Sauté sliced onions until translucent.',
      'Add boiled mashed potatoes, turmeric, salt, 1 cup water, and besan slurry. Simmer 4 minutes until luscious and thick.',
      'Deep fry pooris in hot oil until fully puffed and golden.'
    ]
  },

  // Lunch Items
  'steamed-rice': {
    id: 'steamed-rice',
    name: 'Hot Steamed Ponni Rice',
    tamilName: 'சுடச்சுட சாதம்',
    category: 'Main',
    description: 'Fluffy, freshly pressure-cooked South Indian Ponni parboiled or raw rice, served hot with a drizzle of ghee.',
    prepTime: '5 mins',
    cookTime: '15 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Ponni Rice / Sona Masoori', quantity: '2 cups', category: 'Grains / Staples' },
      { name: 'Water', quantity: '4.5 cups', category: 'Other' },
      { name: 'Ghee (optional)', quantity: '1 tsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Rinse rice twice in clean water.',
      'Add water in pressure cooker (or pot). Cook for 3-4 whistles on medium flame.',
      'Let steam release naturally, then fluff with a flat wooden fork.'
    ]
  },

  'drumstick-sambar': {
    id: 'drumstick-sambar',
    name: 'Murungakkai Sambar (Drumstick Sambar)',
    tamilName: 'முருங்கைக்காய் சாம்பார்',
    category: 'Sambar',
    description: 'The crown jewel of Tamil lunch: tender drumsticks simmered with yellow toor dal, tamarind, and fragrant roasted spices.',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Toor Dal', quantity: '3/4 cup', category: 'Pulses' },
      { name: 'Drumsticks', quantity: '2 cut into 2-inch pieces', category: 'Vegetables' },
      { name: 'Shallots / Onion', quantity: '8-10 shallots', category: 'Vegetables' },
      { name: 'Tomato', quantity: '1 large', category: 'Vegetables' },
      { name: 'Tamarind', quantity: 'lemon-sized ball soaked in warm water', category: 'Spices & Condiments' },
      { name: 'Sambar Powder', quantity: '2 tbsp', category: 'Spices & Condiments' },
      { name: 'Mustard, Fenugreek (Methi) & Hing', quantity: '1/2 tsp each', category: 'Spices & Condiments' }
    ],
    steps: [
      'Pressure cook toor dal with a pinch of turmeric and 2.5 cups water for 4 whistles until mushy. Whisk smooth.',
      'In a heavy pot, boil drumstick pieces, shallots, and tomato in tamarind extract with sambar powder and salt for 8-10 minutes until drumstick is fork-tender.',
      'Add cooked dal to the pot, adjust water consistency, and simmer for 5 minutes.',
      'Temper mustard seeds, fenugreek seeds, dry red chilli, asafoetida, and curry leaves in sesame oil and pour on top. Garnish with coriander.'
    ],
    tips: 'Use the dal water while pressure cooking to make fresh Rasam simultaneously.'
  },

  'vatha-kuzhambu': {
    id: 'vatha-kuzhambu',
    name: 'Sundakkai Vatha Kuzhambu',
    tamilName: 'சுண்டைக்காய் வத்தக்குழம்பு',
    category: 'Kuzhambu',
    description: 'Intensely flavorful, tangy and spicy tamarind stew made with turkey berry (sundakkai) sundried vathal and pure gingelly oil.',
    prepTime: '5 mins',
    cookTime: '18 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Sundakkai or Manathakkali Vathal', quantity: '2 tbsp', category: 'Other' },
      { name: 'Tamarind', quantity: 'lemon sized soaked in 2 cups water', category: 'Spices & Condiments' },
      { name: 'Sesame (Gingelly) Oil', quantity: '2.5 tbsp', category: 'Dairy / Fats' },
      { name: 'Garlic cloves & Shallots', quantity: '10 cloves + 8 shallots', category: 'Vegetables' },
      { name: 'Sambar Powder or Kuzhambu Powder', quantity: '2 tbsp', category: 'Spices & Condiments' },
      { name: 'Mustard seeds & Fenugreek', quantity: '1/2 tsp each', category: 'Spices & Condiments' },
      { name: 'Jaggery', quantity: '1 small piece', category: 'Spices & Condiments' }
    ],
    steps: [
      'Heat sesame oil in an earthern clay pot or kadai. Roast the vathal until fragrant and dark, remove and set aside.',
      'In same oil, add mustard seeds, fenugreek seeds, curry leaves, garlic, and shallots. Sauté until golden.',
      'Add tamarind extract, kuzhambu powder, turmeric, and salt. Simmer on medium flame for 12 minutes until oil floats on top.',
      'Stir in the fried vathal and a small piece of jaggery. Simmer 2 more minutes and turn off.'
    ],
    tips: 'Pairs exceptionally well with sutha appalam and potato roast or kootu to balance the tangy heat.'
  },

  'mor-kuzhambu': {
    id: 'mor-kuzhambu',
    name: 'Vendakkai Mor Kuzhambu (Okra Buttermilk Curry)',
    tamilName: 'வெண்டைக்காய் மோர் குழம்பு',
    category: 'Kuzhambu',
    description: 'Soothing spiced yogurt curry simmered with crisped lady finger, flavored with freshly ground coconut, cumin, and ginger.',
    prepTime: '10 mins',
    cookTime: '12 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Sour Curd / Buttermilk', quantity: '2 cups whisked', category: 'Dairy / Fats' },
      { name: 'Lady Finger (Vendakkai)', quantity: '150g chopped', category: 'Vegetables' },
      { name: 'Fresh Grated Coconut', quantity: '1/3 cup', category: 'Other' },
      { name: 'Cumin seeds, Green Chilli & Ginger', quantity: '1 tsp + 2 chillies + 1/2 inch', category: 'Spices & Condiments' },
      { name: 'Toor Dal (soaked)', quantity: '1 tbsp', category: 'Pulses' },
      { name: 'Turmeric powder', quantity: '1/4 tsp', category: 'Spices & Condiments' }
    ],
    steps: [
      'Grind coconut, soaked toor dal, cumin, green chillies, ginger, and turmeric into a smooth paste.',
      'Sauté chopped vendakkai in 1 tsp oil until completely non-slimy and tender.',
      'Mix ground paste with whisked buttermilk, salt, and cooked okra in a saucepan. Warm on low heat gently.',
      'Do NOT let it boil hard (yogurt will split). When frothy bubbles appear around rim, turn off stove.',
      'Temper with coconut oil, mustard seeds, fenugreek seeds, and curry leaves.'
    ]
  },

  'thakkali-rasam': {
    id: 'thakkali-rasam',
    name: 'Village Style Thakkali Rasam',
    tamilName: 'தக்காளி ரசம்',
    category: 'Rasam',
    description: 'Soul-warming digestive soup made with crushed country tomatoes, garlic, freshly pounded pepper, and cumin.',
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: 4,
    isVegetarian: true,
    isQuick: true,
    ingredients: [
      { name: 'Ripe Country Tomatoes', quantity: '3 crushed by hand', category: 'Vegetables' },
      { name: 'Garlic cloves (crushed with skin)', quantity: '6 cloves', category: 'Vegetables' },
      { name: 'Black Pepper & Cumin', quantity: '1 tsp each coarsely crushed', category: 'Spices & Condiments' },
      { name: 'Tamarind water', quantity: '1/2 cup (light extract)', category: 'Spices & Condiments' },
      { name: 'Cooked Toor Dal water', quantity: '1/2 cup', category: 'Pulses' },
      { name: 'Coriander leaves & Curry leaves', quantity: 'generous handful', category: 'Spices & Condiments' }
    ],
    steps: [
      'In a vessel, mix crushed tomatoes, tamarind water, turmeric, salt, and crushed garlic.',
      'Boil for 5 minutes until tomato raw smell vanishes. Pour in dal water and 1 cup plain water.',
      'Sprinkle coarsely crushed pepper-cumin powder and coriander leaves.',
      'Simmer until a thick golden froth rises across the top. Switch off immediately before rolling boil.',
      'Temper with ghee, mustard seeds, and curry leaves.'
    ]
  },

  'beans-poriyal': {
    id: 'beans-poriyal',
    name: 'Green Beans Paruppu Poriyal',
    tamilName: 'பீன்ஸ் பொரியல்',
    category: 'Poriyal',
    description: 'Crisp green beans sautéed with mustard, split urad dal, green chillies, and finished with fresh grated coconut.',
    prepTime: '8 mins',
    cookTime: '8 mins',
    servings: 4,
    isVegetarian: true,
    isQuick: true,
    ingredients: [
      { name: 'French Beans (finely cut)', quantity: '250g', category: 'Vegetables' },
      { name: 'Fresh Grated Coconut', quantity: '3 tbsp', category: 'Other' },
      { name: 'Mustard seeds & Urad dal', quantity: '1/2 tsp + 1 tsp', category: 'Spices & Condiments' },
      { name: 'Green Chillies & Curry Leaves', quantity: '2 slit + 1 sprig', category: 'Spices & Condiments' },
      { name: 'Coconut Oil or Sesame Oil', quantity: '1 tsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Steam or parboil finely chopped beans with a pinch of turmeric and salt for 5 minutes (keep crunchy).',
      'Heat oil in a kadai, splutter mustard seeds and urad dal until dal is golden.',
      'Toss in green chillies, curry leaves, and drained beans. Sauté for 2 minutes.',
      'Turn off the flame and fold in fresh grated coconut.'
    ]
  },

  'potato-roast': {
    id: 'potato-roast',
    name: 'Crispy Urulaikizhangu Roast (Potato Fry)',
    tamilName: 'உருளைக்கிழங்கு வறுவல்',
    category: 'Side',
    description: 'Tender cubed potatoes slow-roasted on an iron skillet with sambar powder, garlic, and fennel until crispy on outside.',
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Potatoes (boiled & cubed)', quantity: '3 medium (350g)', category: 'Vegetables' },
      { name: 'Sambar Powder / Chilli Powder', quantity: '1.5 tsp', category: 'Spices & Condiments' },
      { name: 'Fennel Seeds (Sombu)', quantity: '1/2 tsp', category: 'Spices & Condiments' },
      { name: 'Garlic (crushed with skin)', quantity: '5 cloves', category: 'Vegetables' },
      { name: 'Curry Leaves', quantity: '2 sprigs', category: 'Spices & Condiments' },
      { name: 'Oil', quantity: '1.5 tbsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Toss boiled potato cubes with sambar powder, turmeric, and salt.',
      'Heat oil in a pan; add fennel seeds, crushed garlic, and curry leaves.',
      'Add seasoned potatoes and roast on medium-low flame without covering, flipping every 3-4 minutes until outer skin turns golden-crusted.'
    ]
  },

  'keerai-kootu': {
    id: 'keerai-kootu',
    name: 'Pasalai Keerai Moong Dal Kootu',
    tamilName: 'கீரை கூட்டு',
    category: 'Kootu',
    description: 'Wholesome spinach simmered with yellow moong dal, finished with a rustic coconut-cumin paste.',
    prepTime: '10 mins',
    cookTime: '12 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Spinach / Keerai (cleaned & chopped)', quantity: '1 big bunch', category: 'Vegetables' },
      { name: 'Yellow Moong Dal', quantity: '1/2 cup', category: 'Pulses' },
      { name: 'Fresh Grated Coconut', quantity: '1/4 cup', category: 'Other' },
      { name: 'Cumin seeds & Green Chilli', quantity: '1 tsp + 1 chilli', category: 'Spices & Condiments' },
      { name: 'Mustard seeds & Urad dal', quantity: '1/2 tsp each', category: 'Spices & Condiments' }
    ],
    steps: [
      'Pressure cook moong dal with turmeric and 1 cup water for 2 whistles.',
      'Coarsely grind coconut, cumin seeds, and green chilli with 2 tbsp water.',
      'Cook chopped spinach in an open pot with 1/4 cup water and salt for 4 minutes.',
      'Add cooked moong dal and coconut-cumin paste; simmer together for 3 minutes.',
      'Temper with mustard seeds, urad dal, and curry leaves in coconut oil.'
    ]
  },

  'meen-kuzhambu': {
    id: 'meen-kuzhambu',
    name: 'Village Style Chettinad Fish Curry',
    tamilName: 'மீன் குழம்பு',
    category: 'Kuzhambu',
    description: 'Tangy, spicy fish curry cooked with shallots, garlic, tomatoes, and tamarind in sesame oil.',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Fresh Seer Fish / Vanjaram or Tilapia', quantity: '500g', category: 'Meat / Seafood' },
      { name: 'Tamarind', quantity: 'lemon-size soaked', category: 'Spices & Condiments' },
      { name: 'Shallots', quantity: '15 peeled', category: 'Vegetables' },
      { name: 'Garlic', quantity: '12 cloves', category: 'Vegetables' },
      { name: 'Kuzhambu Chilli Powder', quantity: '2.5 tbsp', category: 'Spices & Condiments' },
      { name: 'Sesame Oil', quantity: '2 tbsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Heat sesame oil, temper mustard, fenugreek, garlic, curry leaves, and shallots until browned.',
      'Add tomatoes, tamarind water, kuzhambu powder, and salt. Simmer 12 minutes until gravy thickens and oil separates.',
      'Gently slide in washed fish steaks, cover, and cook on gentle flame for 6 minutes without stirring aggressively.'
    ]
  },

  'chettinad-chicken-curry': {
    id: 'chettinad-chicken-curry',
    name: 'Chettinad Kozhi Curry',
    tamilName: 'செட்டிநாடு சிக்கன் குழம்பு',
    category: 'Main',
    description: 'Robust chicken curry cooked in freshly roasted dry spices: peppercorns, coriander, fennel, and star anise.',
    prepTime: '15 mins',
    cookTime: '25 mins',
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Curry Cut Chicken', quantity: '500g', category: 'Meat / Seafood' },
      { name: 'Onions & Tomatoes', quantity: '2 onions + 2 tomatoes', category: 'Vegetables' },
      { name: 'Chettinad Masala (Fennel, Pepper, Cinnamon)', quantity: '2 tbsp freshly ground', category: 'Spices & Condiments' },
      { name: 'Ginger-Garlic Paste', quantity: '1.5 tbsp', category: 'Vegetables' },
      { name: 'Curry Leaves', quantity: '2 sprigs', category: 'Spices & Condiments' }
    ],
    steps: [
      'Sauté onions, curry leaves, and ginger-garlic paste until brown and aromatic.',
      'Add chicken pieces, turmeric, and ground Chettinad masala. Sear on high heat for 3 minutes.',
      'Add tomatoes, 1 cup water, and salt. Cover and simmer 15-18 minutes until chicken is tender.'
    ]
  },

  'curd-pickle-accompaniment': {
    id: 'curd-pickle-accompaniment',
    name: 'Fresh Homemade Curd, Mor Milagai & Pickle',
    tamilName: 'தயிர் & ஊறுகாய்',
    category: 'Accompaniment',
    description: 'Cooling thick set curd, crisp roasted sun-dried curd chillies (mor milagai) and spicy mango pickle.',
    prepTime: '2 mins',
    cookTime: '2 mins',
    servings: 4,
    isVegetarian: true,
    isQuick: true,
    ingredients: [
      { name: 'Set Curd (Yogurt)', quantity: '2 cups', category: 'Dairy / Fats' },
      { name: 'Mor Milagai (Sun-dried curd chilli)', quantity: '4 chillies fried in oil', category: 'Spices & Condiments' },
      { name: 'Lemon or Mango Pickle', quantity: '2 tsp', category: 'Spices & Condiments' }
    ],
    steps: [
      'Serve fresh chilled curd in small bowls.',
      'Quickly flash-fry mor milagai in 1 tsp oil for 30 seconds until dark brown and crispy.',
      'Serve alongside steamed rice at the end of the lunch meal.'
    ]
  },

  // Snacks
  'peanut-sundal': {
    id: 'peanut-sundal',
    name: 'Verkadalai Sundal (Peanut Sundal)',
    tamilName: 'வேர்க்கடலை சுண்டல்',
    category: 'Snack',
    description: 'Tender boiled raw peanuts tossed with mustard seeds, green chilli, asafoetida, and fresh grated coconut.',
    prepTime: '5 mins',
    cookTime: '15 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Raw Peanuts / Groundnuts', quantity: '1.5 cups', category: 'Pulses' },
      { name: 'Fresh Grated Coconut', quantity: '2 tbsp', category: 'Other' },
      { name: 'Mustard seeds & Hing', quantity: '1/2 tsp + generous pinch', category: 'Spices & Condiments' },
      { name: 'Green Chilli & Curry Leaves', quantity: '1 chilli + 1 sprig', category: 'Spices & Condiments' },
      { name: 'Coconut Oil', quantity: '1 tsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Pressure cook raw peanuts with 2 cups water and salt for 3-4 whistles until soft and tender. Drain water.',
      'Heat coconut oil in a pan, crackle mustard seeds, add slit green chilli, hing, and curry leaves.',
      'Add boiled peanuts and toss on high flame for 1 minute.',
      'Turn off stove, fold in grated coconut, and serve hot.'
    ],
    tips: 'High-protein, guilt-free snack perfect with evening filter coffee.'
  },

  'filter-coffee': {
    id: 'filter-coffee',
    name: 'Kumbakonam Degree Filter Coffee',
    tamilName: 'பில்டர் காபி',
    category: 'Beverage',
    description: 'Traditional brass-filtered decoction blended with frothy boiled full-fat milk.',
    prepTime: '5 mins',
    cookTime: '5 mins',
    servings: 4,
    isVegetarian: true,
    isQuick: true,
    ingredients: [
      { name: 'Filter Coffee Powder (80:20 Chicory blend)', quantity: '3 tbsp', category: 'Spices & Condiments' },
      { name: 'Fresh Milk', quantity: '2.5 cups', category: 'Dairy / Fats' },
      { name: 'Sugar', quantity: '2 tbsp (to taste)', category: 'Other' }
    ],
    steps: [
      'Press coffee powder lightly in the top compartment of stainless steel / brass filter. Pour boiling hot water and close lid. Decoction drips in 10 mins.',
      'Boil milk thoroughly until frothy.',
      'Pour 2 tbsp decoction into tumbler, add sugar, pour hot milk from a height to create signature froth (dabarah-tumbler style).'
    ]
  },

  'vazhaipoo-vadai': {
    id: 'vazhaipoo-vadai',
    name: 'Crispy Vazhaipoo Vadai (Banana Blossom Vadai)',
    tamilName: 'வாழைப்பூ வடை',
    category: 'Snack',
    description: 'Crunchy tea-time fritters made of coarse chana dal and finely chopped banana blossom infused with fennel seeds.',
    prepTime: '15 mins',
    cookTime: '15 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Chana Dal (soaked 2 hrs)', quantity: '1 cup', category: 'Pulses' },
      { name: 'Banana Blossom (Vazhaipoo finely chopped)', quantity: '1 cup', category: 'Vegetables' },
      { name: 'Fennel seeds & Dry red chilli', quantity: '1 tsp + 3 chillies', category: 'Spices & Condiments' },
      { name: 'Shallots & Curry leaves', quantity: '6 shallots + 1 sprig', category: 'Vegetables' }
    ],
    steps: [
      'Coarsely grind soaked chana dal with fennel seeds and red chillies without adding water.',
      'Mix in finely chopped banana blossom, shallots, curry leaves, and salt.',
      'Flatten small balls in palm and deep fry in hot oil until deep golden crisp.'
    ]
  },

  // Dinner items
  'chapati-kurma': {
    id: 'chapati-kurma',
    name: 'Soft Phulka Chapatis with Saravana Bhavan Style Veg Kurma',
    tamilName: 'சப்பாத்தி & வெஜிடபிள் குருமா',
    category: 'Tiffin',
    description: 'Whole wheat flatbreads served with aromatic coconut-cashew-poppy seed vegetable kurma.',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Whole Wheat Atta', quantity: '2 cups', category: 'Grains / Staples' },
      { name: 'Mixed Vegetables (Carrot, Beans, Peas, Potato)', quantity: '1.5 cups', category: 'Vegetables' },
      { name: 'Coconut & Cashews', quantity: '1/3 cup + 6 cashews ground', category: 'Other' },
      { name: 'Fennel & Cardamom & Cinnamon', quantity: 'whole spices', category: 'Spices & Condiments' },
      { name: 'Onion & Tomato', quantity: '1 each chopped', category: 'Vegetables' }
    ],
    steps: [
      'Knead soft pliable dough with warm water, roll thinly and puff chapatis on direct tawa flame.',
      'For kurma: pressure cook vegetables with turmeric for 1 whistle.',
      'Temper whole spices, sauté onion, ginger-garlic, tomato, add ground coconut-cashew paste and 1 cup water.',
      'Simmer for 6 minutes until rich and fragrant.'
    ]
  },

  'kuzhi-paniyaram': {
    id: 'kuzhi-paniyaram',
    name: 'Chettinad Kara Kuzhi Paniyaram',
    tamilName: 'செட்டிநாடு குழி பணியாரம்',
    category: 'Tiffin',
    description: 'Crispy outside, spongy inside dumplings made from fermented batter seasoned with sautéed shallots, mustard, and green chillies.',
    prepTime: '5 mins',
    cookTime: '12 mins',
    servings: 4,
    isVegetarian: true,
    isQuick: true,
    ingredients: [
      { name: 'Fermented Idli/Dosa Batter', quantity: '3 cups', category: 'Grains / Staples' },
      { name: 'Shallots (finely chopped)', quantity: '8 shallots', category: 'Vegetables' },
      { name: 'Mustard seeds & Chana dal', quantity: '1/2 tsp + 1 tsp', category: 'Spices & Condiments' },
      { name: 'Green chillies & Ginger', quantity: '1 chilli + 1/2 tsp minced', category: 'Vegetables' },
      { name: 'Sesame Oil', quantity: '1 tbsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Sauté mustard seeds, chana dal, chopped shallots, green chillies, and curry leaves in 1 tsp oil until light golden.',
      'Mix the sautéed tempering into the batter.',
      'Heat paniyaram chatti (pan), add 2 drops oil in each depression, fill 3/4th with batter.',
      'Cook on medium flame covered for 2 mins, flip with skewer and cook other side until crisp.'
    ]
  },

  'tomato-onion-chutney': {
    id: 'tomato-onion-chutney',
    name: 'Kara Chutney (Spicy Tomato Onion Chutney)',
    tamilName: 'கார சட்னி',
    category: 'Chutney',
    description: 'Fiery and tangy red chutney made with sautéed country tomatoes, onions, garlic, and dried red chillies.',
    prepTime: '5 mins',
    cookTime: '8 mins',
    servings: 4,
    isVegetarian: true,
    isQuick: true,
    ingredients: [
      { name: 'Onions', quantity: '2 chopped', category: 'Vegetables' },
      { name: 'Tomatoes', quantity: '3 chopped', category: 'Vegetables' },
      { name: 'Dried Red Chillies (Guntur / Byadgi)', quantity: '4', category: 'Spices & Condiments' },
      { name: 'Garlic cloves', quantity: '4', category: 'Vegetables' },
      { name: 'Sesame Oil', quantity: '1 tbsp', category: 'Dairy / Fats' }
    ],
    steps: [
      'Sauté red chillies, garlic, onions, and tomatoes in sesame oil until tomatoes soften and oil glazes.',
      'Cool slightly and grind into a smooth sauce with salt and a small piece of tamarind.',
      'Temper with mustard seeds and curry leaves.'
    ]
  }
};

// Preset balanced daily menus for variety, offline support & instant generation
export const CURATED_MENUS: DailyMenu[] = [
  {
    id: 'menu-tamil-comfort-1',
    date: new Date().toISOString().split('T')[0],
    dayName: 'Today',
    title: 'Comforting Tamil Traditional Feast',
    theme: 'Everyday Household Balance',
    servings: 4,
    cuisine: 'tamil',
    dietType: 'veg',
    totalCookingTime: '1 hr 15 mins',
    estimatedCost: '₹180 - ₹240',
    breakfast: {
      type: 'breakfast',
      title: 'Ven Pongal & Fresh Coconut Chutney',
      highlights: ['Pepper-cumin digestive tempering', 'No fermentation needed', 'Rich in moong dal protein'],
      dishes: [
        DISH_CATALOG['ven-pongal'],
        DISH_CATALOG['coconut-chutney'],
        DISH_CATALOG['tiffin-sambar']
      ]
    },
    lunch: {
      type: 'lunch',
      title: 'Grand South Indian Rice Thali with Murungakkai Sambar',
      highlights: ['Fresh drumstick aromatics', 'Digestive rasam', 'Crunchy beans poriyal'],
      dishes: [
        DISH_CATALOG['steamed-rice'],
        DISH_CATALOG['drumstick-sambar'],
        DISH_CATALOG['beans-poriyal'],
        DISH_CATALOG['thakkali-rasam'],
        DISH_CATALOG['curd-pickle-accompaniment']
      ]
    },
    snack: {
      type: 'snack',
      title: 'Boiled Verkadalai Sundal & Kumbakonam Degree Filter Coffee',
      highlights: ['High-protein healthy snack', 'Authentic chicory coffee decoction'],
      dishes: [
        DISH_CATALOG['peanut-sundal'],
        DISH_CATALOG['filter-coffee']
      ]
    },
    dinner: {
      type: 'dinner',
      title: 'Crisp Kara Kuzhi Paniyaram & Spicy Tomato Onion Chutney',
      highlights: ['Light on stomach', 'Uses leftover batter with smart onion tempering', 'Quick to make in 15 mins'],
      dishes: [
        DISH_CATALOG['kuzhi-paniyaram'],
        DISH_CATALOG['tomato-onion-chutney']
      ]
    },
    ingredientReuse: [
      {
        ingredient: 'Grated Coconut',
        usedIn: ['Morning Coconut Chutney', 'Lunch Beans Poriyal', 'Evening Peanut Sundal'],
        tip: 'Grate 1 fresh coconut in the morning and split across breakfast chutney, lunch poriyal, and evening sundal.'
      },
      {
        ingredient: 'Toor Dal & Dal Water',
        usedIn: ['Lunch Sambar', 'Tomato Rasam'],
        tip: 'Pressure cook dal with extra water; ladle out clear top dal water for Rasam and use thick bottom dal for Sambar.'
      },
      {
        ingredient: 'Shallots (Small Onions)',
        usedIn: ['Tiffin Sambar', 'Lunch Drumstick Sambar', 'Dinner Paniyaram'],
        tip: 'Peel 25 shallots at once in warm water in the morning for all 3 meals.'
      }
    ],
    preparationPlan: [
      {
        time: '7:15 AM',
        phase: 'Morning Tiffin Workflow',
        tasks: [
          'Wash and pressure cook raw rice and moong dal for Pongal (4 whistles).',
          'Quickly grate 1 coconut. Grind white coconut chutney and temper.',
          'Heat ghee with cashews, crushed pepper, cumin, ginger, and curry leaves; pour over hot pongal.'
        ]
      },
      {
        time: '11:15 AM',
        phase: 'Lunch Multi-Pot Workflow',
        tasks: [
          'Burner 1: Pressure cook rice for 3 whistles.',
          'Burner 2: Pressure cook toor dal with turmeric; strain dal water into rasam pot.',
          'Burner 3: Boil drumsticks and shallots in tamarind extract with sambar powder; add cooked dal and temper.',
          'Side pan: Steam finely chopped beans and toss with mustard, urad dal, and coconut.',
          'Simmer crushed tomato-pepper rasam until frothy.'
        ]
      },
      {
        time: '4:30 PM',
        phase: 'Evening Tea-Time',
        tasks: [
          'Pressure cook raw peanuts for 3 whistles.',
          'Brew hot filter coffee decoction and temper peanuts with mustard, curry leaves, and grated coconut.'
        ]
      },
      {
        time: '7:45 PM',
        phase: 'Light Dinner Prep',
        tasks: [
          'Sauté chopped onions, green chillies, and mustard seeds; mix into dosa batter.',
          'Sauté tomatoes, onions, garlic, and red chillies for Kara chutney; blend smoothly.',
          'Pour batter into paniyaram pan and fry until golden crisp.'
        ]
      }
    ],
    shoppingList: [
      {
        category: 'Vegetables',
        items: [
          { name: 'Drumsticks', quantity: '2 sticks', haveAtHome: false },
          { name: 'Green French Beans', quantity: '250g', haveAtHome: false },
          { name: 'Shallots (Sambar Vengayam)', quantity: '250g', haveAtHome: false },
          { name: 'Country Tomatoes', quantity: '6 medium', haveAtHome: false },
          { name: 'Onions', quantity: '3 medium', haveAtHome: false },
          { name: 'Curry leaves & Coriander', quantity: '2 fresh bunches', haveAtHome: false },
          { name: 'Ginger & Green Chillies', quantity: '100g each', haveAtHome: false }
        ]
      },
      {
        category: 'Grains / Staples',
        items: [
          { name: 'Ponni Rice / Raw Rice', quantity: '1 kg', haveAtHome: false },
          { name: 'Idli/Dosa Batter', quantity: '1 kg packet / homemade', haveAtHome: false }
        ]
      },
      {
        category: 'Pulses',
        items: [
          { name: 'Toor Dal', quantity: '250g', haveAtHome: false },
          { name: 'Yellow Moong Dal', quantity: '200g', haveAtHome: false },
          { name: 'Raw Peanuts', quantity: '200g', haveAtHome: false }
        ]
      },
      {
        category: 'Dairy / Fats & Other',
        items: [
          { name: 'Fresh Coconut', quantity: '1 whole nut', haveAtHome: false },
          { name: 'Cow Milk', quantity: '500 ml', haveAtHome: false },
          { name: 'Set Curd', quantity: '500 ml', haveAtHome: false },
          { name: 'Ghee', quantity: '100g', haveAtHome: false },
          { name: 'Filter Coffee Powder', quantity: '100g', haveAtHome: false }
        ]
      }
    ],
    createdAt: new Date().toISOString()
  },

  {
    id: 'menu-tamil-vatha-2',
    date: new Date().toISOString().split('T')[0],
    dayName: 'Today',
    title: 'Rustic Village Style Vatha Kuzhambu & Potato Roast',
    theme: 'Tangy, Crunchy, Comforting',
    servings: 4,
    cuisine: 'tamil',
    dietType: 'veg',
    totalCookingTime: '55 mins',
    estimatedCost: '₹160 - ₹210',
    breakfast: {
      type: 'breakfast',
      title: 'Mallipoo Idlis with Kara Chutney & Coconut Chutney',
      highlights: ['Steamed healthy tiffin', 'Zero oil main', 'Dual chutney contrast'],
      dishes: [
        DISH_CATALOG['idli'],
        DISH_CATALOG['coconut-chutney'],
        DISH_CATALOG['tomato-onion-chutney']
      ]
    },
    lunch: {
      type: 'lunch',
      title: 'Steamed Rice with Tangy Sundakkai Vatha Kuzhambu & Golden Potato Roast',
      highlights: ['No dal needed for kuzhambu', 'Crisp iron-roast potatoes', 'Cooling curd finish'],
      dishes: [
        DISH_CATALOG['steamed-rice'],
        DISH_CATALOG['vatha-kuzhambu'],
        DISH_CATALOG['potato-roast'],
        DISH_CATALOG['keerai-kootu'],
        DISH_CATALOG['curd-pickle-accompaniment']
      ]
    },
    snack: {
      type: 'snack',
      title: 'Peanut Sundal & Fresh Ginger Tea',
      highlights: ['Nutritious protein', 'Quick to prepare'],
      dishes: [
        DISH_CATALOG['peanut-sundal'],
        DISH_CATALOG['filter-coffee']
      ]
    },
    dinner: {
      type: 'dinner',
      title: 'Nutritious Instant Ragi Dosa with Coconut Chutney',
      highlights: ['High calcium and fiber', 'Diabetic friendly', 'Quick 15 min prep'],
      dishes: [
        DISH_CATALOG['ragi-dosa'],
        DISH_CATALOG['coconut-chutney']
      ]
    },
    ingredientReuse: [
      {
        ingredient: 'Potatoes',
        usedIn: ['Lunch Potato Roast'],
        tip: 'Boil extra potatoes in the morning while boiling water for idlis to cut lunch cooking time by half.'
      },
      {
        ingredient: 'Grated Coconut',
        usedIn: ['Morning Coconut Chutney', 'Keerai Kootu', 'Dinner Chutney'],
        tip: 'Divide freshly grated coconut into 2 parts; grind morning batch and keep evening batch refrigerated.'
      }
    ],
    preparationPlan: [
      {
        time: '7:30 AM',
        phase: 'Breakfast Steaming',
        tasks: [
          'Pour idli batter in greased plates and steam for 8 mins.',
          'Grind fresh coconut chutney and spicy tomato kara chutney in 5 mins.'
        ]
      },
      {
        time: '11:30 AM',
        phase: 'Lunch Cooking',
        tasks: [
          'Boil 3 potatoes in pressure cooker.',
          'In a clay pot, fry sundakkai vathal in sesame oil, sauté garlic and shallots, simmer tamarind extract with kuzhambu powder until oil floats.',
          'Chop boiled potatoes, toss with sambar powder, and roast on iron tawa with fennel and curry leaves until crusty.',
          'Cook spinach with moong dal and coconut cumin paste for 10 mins.'
        ]
      },
      {
        time: '8:00 PM',
        phase: 'Dinner Dosa',
        tasks: [
          'Whisk ragi flour, rice flour, curd, cumin, chopped onions, and water into a thin batter.',
          'Pour on hot tawa to make crispy, lacey ragi dosas in 10 mins.'
        ]
      }
    ],
    shoppingList: [
      {
        category: 'Vegetables',
        items: [
          { name: 'Potatoes', quantity: '500g', haveAtHome: false },
          { name: 'Fresh Spinach / Pasalai Keerai', quantity: '1 big bunch', haveAtHome: false },
          { name: 'Shallots', quantity: '200g', haveAtHome: false },
          { name: 'Garlic', quantity: '1 whole head', haveAtHome: false },
          { name: 'Onions', quantity: '3 medium', haveAtHome: false },
          { name: 'Tomatoes', quantity: '4 medium', haveAtHome: false }
        ]
      },
      {
        category: 'Grains / Staples',
        items: [
          { name: 'Ragi Flour', quantity: '500g', haveAtHome: false },
          { name: 'Ponni Rice', quantity: '1 kg', haveAtHome: false },
          { name: 'Idli Batter', quantity: '1 kg', haveAtHome: false }
        ]
      },
      {
        category: 'Pulses',
        items: [
          { name: 'Yellow Moong Dal', quantity: '200g', haveAtHome: false }
        ]
      },
      {
        category: 'Dairy / Fats & Other',
        items: [
          { name: 'Sundakkai Vathal', quantity: '1 small packet (50g)', haveAtHome: false },
          { name: 'Pure Sesame (Gingelly) Oil', quantity: '200 ml', haveAtHome: false },
          { name: 'Fresh Coconut', quantity: '1 whole', haveAtHome: false },
          { name: 'Curd', quantity: '500 ml', haveAtHome: false }
        ]
      }
    ],
    createdAt: new Date().toISOString()
  },

  {
    id: 'menu-tamil-nonveg-3',
    date: new Date().toISOString().split('T')[0],
    dayName: 'Today',
    title: 'Sunday Chettinad Non-Veg Special Feast',
    theme: 'Chettinad Spiced & Hearty',
    servings: 4,
    cuisine: 'tamil',
    dietType: 'non-veg',
    totalCookingTime: '1 hr 20 mins',
    estimatedCost: '₹340 - ₹450',
    breakfast: {
      type: 'breakfast',
      title: 'Puffy Poori with Potato Masala',
      highlights: ['Sunday treat', 'Puffed golden pooris', 'Classic hotel style yellow masala'],
      dishes: [
        DISH_CATALOG['poori-masala'],
        DISH_CATALOG['filter-coffee']
      ]
    },
    lunch: {
      type: 'lunch',
      title: 'Chettinad Chicken Kozhi Curry with Steamed Rice & Pepper Rasam',
      highlights: ['Fresh stone-ground spices', 'Spicy aromatic pepper gravy', 'Digestive hot rasam'],
      dishes: [
        DISH_CATALOG['steamed-rice'],
        DISH_CATALOG['chettinad-chicken-curry'],
        DISH_CATALOG['beans-poriyal'],
        DISH_CATALOG['thakkali-rasam'],
        DISH_CATALOG['curd-pickle-accompaniment']
      ]
    },
    snack: {
      type: 'snack',
      title: 'Crispy Banana Blossom (Vazhaipoo) Vadai & Tea',
      highlights: ['Fennel scented crunchy vadai', 'Traditional tea-time favorite'],
      dishes: [
        DISH_CATALOG['vazhaipoo-vadai'],
        DISH_CATALOG['filter-coffee']
      ]
    },
    dinner: {
      type: 'dinner',
      title: 'Soft Phulka Chapatis with Leftover Chicken Gravy & Light Dal',
      highlights: ['Smart dinner reuse of lunch gravy', 'Whole wheat healthy flatbreads'],
      dishes: [
        DISH_CATALOG['chapati-kurma'],
        DISH_CATALOG['coconut-chutney']
      ]
    },
    ingredientReuse: [
      {
        ingredient: 'Chettinad Chicken Gravy',
        usedIn: ['Lunch Rice Dish', 'Dinner Chapati Accompaniment'],
        tip: 'Cook a hearty batch of Chettinad chicken curry for lunch so you only need to make soft chapatis at night without extra cooking.'
      },
      {
        ingredient: 'Potatoes & Onions',
        usedIn: ['Breakfast Poori Masala', 'Lunch Chicken Curry base'],
        tip: 'Boil potatoes and peel onions in one batch.'
      }
    ],
    preparationPlan: [
      {
        time: '8:00 AM',
        phase: 'Sunday Breakfast',
        tasks: [
          'Knead whole wheat dough for pooris; rest for 10 mins.',
          'Prepare yellow potato masala with onions, turmeric, and green chillies.',
          'Fry puffy pooris hot and serve with filter coffee.'
        ]
      },
      {
        time: '11:30 AM',
        phase: 'Chettinad Chicken Lunch Feast',
        tasks: [
          'Roast whole spices: fennel, pepper, coriander seeds, and dry chillies; grind fresh.',
          'Sauté onions, ginger-garlic paste, curry leaves, and chicken pieces; simmer in spiced gravy for 20 mins.',
          'Steam Ponni rice and prepare garlic-tomato digestive rasam.',
          'Sauté quick beans poriyal.'
        ]
      },
      {
        time: '8:00 PM',
        phase: 'Easy Evening Dinner',
        tasks: [
          'Roll chapatis and puff on tawa.',
          'Warm lunch Chettinad chicken curry and serve hot.'
        ]
      }
    ],
    shoppingList: [
      {
        category: 'Meat / Seafood',
        items: [
          { name: 'Curry Cut Chicken', quantity: '750g', haveAtHome: false }
        ]
      },
      {
        category: 'Vegetables',
        items: [
          { name: 'Potatoes', quantity: '500g', haveAtHome: false },
          { name: 'Country Tomatoes', quantity: '500g', haveAtHome: false },
          { name: 'Red Onions', quantity: '500g', haveAtHome: false },
          { name: 'Beans', quantity: '250g', haveAtHome: false },
          { name: 'Fresh Ginger & Garlic', quantity: '150g each', haveAtHome: false },
          { name: 'Curry leaves & Coriander', quantity: '2 bunches', haveAtHome: false }
        ]
      },
      {
        category: 'Grains / Staples',
        items: [
          { name: 'Whole Wheat Atta', quantity: '1 kg', haveAtHome: false },
          { name: 'Ponni Rice', quantity: '1 kg', haveAtHome: false }
        ]
      },
      {
        category: 'Pulses & Other',
        items: [
          { name: 'Toor Dal', quantity: '200g', haveAtHome: false },
          { name: 'Fresh Coconut', quantity: '1 whole', haveAtHome: false },
          { name: 'Full-fat Milk', quantity: '500 ml', haveAtHome: false }
        ]
      }
    ],
    createdAt: new Date().toISOString()
  }
];

// Helper to calculate ingredient scaling for a given serving count
export function scaleRecipeIngredients(ingredients: Dish['ingredients'], baseServings: number, targetServings: number): Dish['ingredients'] {
  if (baseServings === targetServings) return ingredients;
  const ratio = targetServings / baseServings;

  return ingredients.map(ing => {
    // Look for numbers in quantity string
    const match = ing.quantity.match(/^([\d./]+)\s*(.*)$/);
    if (!match) return ing;

    const rawNum = match[1];
    const unit = match[2];

    let numVal: number;
    if (rawNum.includes('/')) {
      const parts = rawNum.split('/');
      numVal = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      numVal = parseFloat(rawNum);
    }

    if (isNaN(numVal)) return ing;

    const scaled = Math.round(numVal * ratio * 10) / 10;
    // Format nicely
    const formattedNum = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1);
    return {
      ...ing,
      quantity: `${formattedNum} ${unit}`.trim()
    };
  });
}

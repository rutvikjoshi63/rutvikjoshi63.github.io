// Food Database - ~250 common foods with macros per serving
// Format: { name, calories, protein, carbs, fat, serving }

const FOOD_DB = [
  // Proteins - Chicken
  { name: "Chicken Breast (grilled)", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: "100g" },
  { name: "Chicken Thigh (grilled)", calories: 209, protein: 26, carbs: 0, fat: 10.9, serving: "100g" },
  { name: "Chicken Wings (6 pcs)", calories: 430, protein: 36, carbs: 0, fat: 30, serving: "6 wings" },
  { name: "Chicken Tikka", calories: 150, protein: 25, carbs: 5, fat: 4, serving: "100g" },
  { name: "Butter Chicken", calories: 240, protein: 18, carbs: 8, fat: 15, serving: "200g" },

  // Proteins - Eggs
  { name: "Egg (whole, boiled)", calories: 78, protein: 6, carbs: 0.6, fat: 5, serving: "1 large" },
  { name: "Egg (whole, fried)", calories: 90, protein: 6, carbs: 0.4, fat: 7, serving: "1 large" },
  { name: "Egg Whites (3)", calories: 51, protein: 11, carbs: 0.7, fat: 0.2, serving: "3 whites" },
  { name: "Omelette (2 eggs)", calories: 188, protein: 13, carbs: 1, fat: 14, serving: "2 eggs" },
  { name: "Scrambled Eggs (2)", calories: 200, protein: 13, carbs: 2, fat: 15, serving: "2 eggs" },

  // Proteins - Fish & Seafood
  { name: "Salmon (grilled)", calories: 208, protein: 20, carbs: 0, fat: 13, serving: "100g" },
  { name: "Tuna (canned in water)", calories: 116, protein: 26, carbs: 0, fat: 1, serving: "100g" },
  { name: "Shrimp (cooked)", calories: 99, protein: 24, carbs: 0.2, fat: 0.3, serving: "100g" },
  { name: "Tilapia (baked)", calories: 128, protein: 26, carbs: 0, fat: 2.6, serving: "100g" },
  { name: "Fish Curry", calories: 180, protein: 18, carbs: 6, fat: 9, serving: "200g" },

  // Proteins - Red Meat
  { name: "Beef (lean, grilled)", calories: 250, protein: 26, carbs: 0, fat: 15, serving: "100g" },
  { name: "Ground Beef (90% lean)", calories: 176, protein: 20, carbs: 0, fat: 10, serving: "100g" },
  { name: "Steak (sirloin)", calories: 271, protein: 26, carbs: 0, fat: 18, serving: "150g" },
  { name: "Lamb (lean)", calories: 258, protein: 25, carbs: 0, fat: 17, serving: "100g" },
  { name: "Turkey Breast", calories: 135, protein: 30, carbs: 0, fat: 1, serving: "100g" },

  // Proteins - Plant
  { name: "Tofu (firm)", calories: 144, protein: 17, carbs: 3, fat: 9, serving: "150g" },
  { name: "Paneer", calories: 265, protein: 18, carbs: 1.2, fat: 21, serving: "100g" },
  { name: "Tempeh", calories: 192, protein: 20, carbs: 8, fat: 11, serving: "100g" },
  { name: "Black Beans (cooked)", calories: 132, protein: 9, carbs: 24, fat: 0.5, serving: "100g" },
  { name: "Chickpeas (cooked)", calories: 164, protein: 9, carbs: 27, fat: 2.6, serving: "100g" },
  { name: "Lentils (cooked)", calories: 116, protein: 9, carbs: 20, fat: 0.4, serving: "100g" },
  { name: "Dal (moong)", calories: 105, protein: 7, carbs: 18, fat: 0.4, serving: "150g" },
  { name: "Dal (toor)", calories: 130, protein: 8, carbs: 22, fat: 1, serving: "150g" },
  { name: "Rajma (kidney beans)", calories: 140, protein: 9, carbs: 24, fat: 0.5, serving: "150g" },
  { name: "Chole (chickpea curry)", calories: 200, protein: 10, carbs: 28, fat: 6, serving: "200g" },

  // Dairy & Alternatives
  { name: "Greek Yogurt (plain)", calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: "170g" },
  { name: "Greek Yogurt (flavored)", calories: 150, protein: 15, carbs: 18, fat: 2, serving: "170g" },
  { name: "Milk (whole)", calories: 149, protein: 8, carbs: 12, fat: 8, serving: "240ml" },
  { name: "Milk (2%)", calories: 122, protein: 8, carbs: 12, fat: 5, serving: "240ml" },
  { name: "Milk (skim)", calories: 83, protein: 8, carbs: 12, fat: 0.2, serving: "240ml" },
  { name: "Cottage Cheese", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, serving: "100g" },
  { name: "Cheddar Cheese", calories: 113, protein: 7, carbs: 0.4, fat: 9, serving: "28g" },
  { name: "Mozzarella", calories: 85, protein: 6, carbs: 0.7, fat: 6, serving: "28g" },
  { name: "Whey Protein (scoop)", calories: 120, protein: 24, carbs: 3, fat: 1.5, serving: "1 scoop" },
  { name: "Casein Protein (scoop)", calories: 120, protein: 24, carbs: 3, fat: 1, serving: "1 scoop" },
  { name: "Protein Bar", calories: 220, protein: 20, carbs: 22, fat: 8, serving: "1 bar" },
  { name: "Dahi (curd)", calories: 60, protein: 3, carbs: 5, fat: 3, serving: "100g" },
  { name: "Lassi (sweet)", calories: 150, protein: 5, carbs: 25, fat: 4, serving: "250ml" },
  { name: "Buttermilk (chaas)", calories: 40, protein: 2, carbs: 5, fat: 1, serving: "250ml" },

  // Grains & Carbs
  { name: "White Rice (cooked)", calories: 206, protein: 4, carbs: 45, fat: 0.4, serving: "1 cup" },
  { name: "Brown Rice (cooked)", calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: "1 cup" },
  { name: "Roti (wheat)", calories: 120, protein: 3, carbs: 20, fat: 3.5, serving: "1 roti" },
  { name: "Naan", calories: 260, protein: 8, carbs: 45, fat: 5, serving: "1 naan" },
  { name: "Paratha (plain)", calories: 200, protein: 4, carbs: 28, fat: 8, serving: "1 paratha" },
  { name: "Paratha (stuffed)", calories: 280, protein: 6, carbs: 32, fat: 14, serving: "1 paratha" },
  { name: "Oats (cooked)", calories: 154, protein: 6, carbs: 27, fat: 2.6, serving: "1 cup" },
  { name: "Overnight Oats", calories: 280, protein: 12, carbs: 42, fat: 8, serving: "1 cup" },
  { name: "Quinoa (cooked)", calories: 222, protein: 8, carbs: 39, fat: 3.5, serving: "1 cup" },
  { name: "Pasta (cooked)", calories: 220, protein: 8, carbs: 43, fat: 1.3, serving: "1 cup" },
  { name: "Bread (white, 1 slice)", calories: 79, protein: 3, carbs: 15, fat: 1, serving: "1 slice" },
  { name: "Bread (whole wheat)", calories: 81, protein: 4, carbs: 14, fat: 1.1, serving: "1 slice" },
  { name: "Bagel (plain)", calories: 270, protein: 10, carbs: 53, fat: 1.5, serving: "1 bagel" },
  { name: "Tortilla (flour)", calories: 140, protein: 4, carbs: 24, fat: 3.5, serving: "1 tortilla" },
  { name: "Sweet Potato", calories: 103, protein: 2, carbs: 24, fat: 0.1, serving: "100g" },
  { name: "Potato (baked)", calories: 161, protein: 4, carbs: 37, fat: 0.2, serving: "1 medium" },
  { name: "Poha", calories: 180, protein: 3, carbs: 32, fat: 5, serving: "1 plate" },
  { name: "Upma", calories: 200, protein: 5, carbs: 30, fat: 7, serving: "1 plate" },
  { name: "Idli (2)", calories: 130, protein: 4, carbs: 26, fat: 0.4, serving: "2 idli" },
  { name: "Dosa (plain)", calories: 120, protein: 3, carbs: 20, fat: 3, serving: "1 dosa" },
  { name: "Dosa (masala)", calories: 200, protein: 4, carbs: 28, fat: 8, serving: "1 dosa" },

  // Vegetables
  { name: "Broccoli (steamed)", calories: 55, protein: 4, carbs: 11, fat: 0.6, serving: "1 cup" },
  { name: "Spinach (cooked)", calories: 41, protein: 5, carbs: 7, fat: 0.5, serving: "1 cup" },
  { name: "Mixed Vegetables", calories: 60, protein: 3, carbs: 12, fat: 0.3, serving: "1 cup" },
  { name: "Salad (garden)", calories: 35, protein: 2, carbs: 7, fat: 0.2, serving: "1 cup" },
  { name: "Avocado", calories: 240, protein: 3, carbs: 12, fat: 22, serving: "1 medium" },
  { name: "Corn (on cob)", calories: 88, protein: 3, carbs: 19, fat: 1.4, serving: "1 ear" },
  { name: "Bhindi (okra) fry", calories: 80, protein: 2, carbs: 8, fat: 5, serving: "100g" },
  { name: "Aloo Gobi", calories: 150, protein: 3, carbs: 18, fat: 7, serving: "150g" },
  { name: "Palak Paneer", calories: 280, protein: 14, carbs: 8, fat: 22, serving: "200g" },
  { name: "Baingan Bharta", calories: 120, protein: 3, carbs: 10, fat: 8, serving: "150g" },
  { name: "Mixed Sabzi", calories: 100, protein: 3, carbs: 12, fat: 5, serving: "150g" },

  // Fruits
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: "1 medium" },
  { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: "1 medium" },
  { name: "Orange", calories: 62, protein: 1, carbs: 15, fat: 0.2, serving: "1 medium" },
  { name: "Mango", calories: 150, protein: 1.5, carbs: 35, fat: 1, serving: "1 cup" },
  { name: "Grapes", calories: 62, protein: 0.6, carbs: 16, fat: 0.3, serving: "1 cup" },
  { name: "Blueberries", calories: 84, protein: 1, carbs: 21, fat: 0.5, serving: "1 cup" },
  { name: "Strawberries", calories: 49, protein: 1, carbs: 12, fat: 0.5, serving: "1 cup" },
  { name: "Watermelon", calories: 46, protein: 1, carbs: 12, fat: 0.2, serving: "1 cup" },
  { name: "Papaya", calories: 62, protein: 0.7, carbs: 16, fat: 0.4, serving: "1 cup" },
  { name: "Pineapple", calories: 82, protein: 0.9, carbs: 22, fat: 0.2, serving: "1 cup" },

  // Nuts & Seeds
  { name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, serving: "28g" },
  { name: "Peanuts", calories: 161, protein: 7, carbs: 5, fat: 14, serving: "28g" },
  { name: "Peanut Butter", calories: 188, protein: 8, carbs: 6, fat: 16, serving: "2 tbsp" },
  { name: "Walnuts", calories: 185, protein: 4, carbs: 4, fat: 18, serving: "28g" },
  { name: "Cashews", calories: 157, protein: 5, carbs: 9, fat: 12, serving: "28g" },
  { name: "Mixed Nuts", calories: 172, protein: 5, carbs: 7, fat: 15, serving: "28g" },
  { name: "Chia Seeds", calories: 137, protein: 4, carbs: 12, fat: 9, serving: "28g" },
  { name: "Flax Seeds", calories: 55, protein: 2, carbs: 3, fat: 4, serving: "1 tbsp" },
  { name: "Trail Mix", calories: 175, protein: 4, carbs: 16, fat: 11, serving: "30g" },

  // Fast Food & Restaurant
  { name: "Pizza (1 slice, cheese)", calories: 272, protein: 12, carbs: 34, fat: 10, serving: "1 slice" },
  { name: "Pizza (1 slice, pepperoni)", calories: 311, protein: 13, carbs: 34, fat: 14, serving: "1 slice" },
  { name: "Burger (single patty)", calories: 354, protein: 20, carbs: 29, fat: 17, serving: "1 burger" },
  { name: "Burger (double patty)", calories: 540, protein: 34, carbs: 32, fat: 30, serving: "1 burger" },
  { name: "French Fries (medium)", calories: 365, protein: 4, carbs: 48, fat: 17, serving: "1 medium" },
  { name: "Chicken Sandwich", calories: 420, protein: 28, carbs: 42, fat: 16, serving: "1 sandwich" },
  { name: "Burrito (chicken)", calories: 550, protein: 30, carbs: 60, fat: 20, serving: "1 burrito" },
  { name: "Subway (6-inch turkey)", calories: 280, protein: 18, carbs: 46, fat: 3.5, serving: "6-inch" },
  { name: "Sushi Roll (6 pcs)", calories: 250, protein: 9, carbs: 38, fat: 7, serving: "6 pcs" },
  { name: "Tacos (2, beef)", calories: 340, protein: 18, carbs: 26, fat: 18, serving: "2 tacos" },
  { name: "Chipotle Bowl", calories: 665, protein: 36, carbs: 73, fat: 24, serving: "1 bowl" },
  { name: "Samosa (2)", calories: 260, protein: 5, carbs: 30, fat: 14, serving: "2 pcs" },
  { name: "Vada Pav", calories: 290, protein: 5, carbs: 38, fat: 13, serving: "1 pc" },
  { name: "Pav Bhaji", calories: 400, protein: 10, carbs: 50, fat: 18, serving: "1 plate" },
  { name: "Biryani (chicken)", calories: 400, protein: 22, carbs: 48, fat: 14, serving: "1 plate" },
  { name: "Biryani (veg)", calories: 320, protein: 8, carbs: 50, fat: 10, serving: "1 plate" },
  { name: "Fried Rice", calories: 350, protein: 8, carbs: 52, fat: 12, serving: "1 plate" },
  { name: "Hakka Noodles", calories: 320, protein: 7, carbs: 48, fat: 11, serving: "1 plate" },

  // Beverages
  { name: "Coffee (black)", calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: "240ml" },
  { name: "Coffee (with milk)", calories: 60, protein: 3, carbs: 6, fat: 2.5, serving: "240ml" },
  { name: "Latte", calories: 150, protein: 8, carbs: 15, fat: 6, serving: "350ml" },
  { name: "Cappuccino", calories: 120, protein: 6, carbs: 12, fat: 5, serving: "240ml" },
  { name: "Chai (tea with milk)", calories: 80, protein: 2, carbs: 12, fat: 3, serving: "240ml" },
  { name: "Green Tea", calories: 2, protein: 0, carbs: 0, fat: 0, serving: "240ml" },
  { name: "Orange Juice", calories: 112, protein: 2, carbs: 26, fat: 0.5, serving: "240ml" },
  { name: "Protein Shake", calories: 200, protein: 30, carbs: 15, fat: 3, serving: "350ml" },
  { name: "Smoothie (fruit)", calories: 230, protein: 4, carbs: 50, fat: 2, serving: "350ml" },
  { name: "Coconut Water", calories: 46, protein: 2, carbs: 9, fat: 0.5, serving: "240ml" },
  { name: "Nimbu Pani", calories: 50, protein: 0, carbs: 12, fat: 0, serving: "250ml" },

  // Snacks
  { name: "Chips (potato)", calories: 160, protein: 2, carbs: 15, fat: 10, serving: "28g" },
  { name: "Popcorn (plain)", calories: 93, protein: 3, carbs: 19, fat: 1, serving: "3 cups" },
  { name: "Dark Chocolate", calories: 170, protein: 2, carbs: 13, fat: 12, serving: "30g" },
  { name: "Granola Bar", calories: 190, protein: 4, carbs: 29, fat: 7, serving: "1 bar" },
  { name: "Rice Cake", calories: 35, protein: 1, carbs: 7, fat: 0.3, serving: "1 cake" },
  { name: "Crackers (whole wheat)", calories: 120, protein: 3, carbs: 20, fat: 3, serving: "5 crackers" },
  { name: "Hummus", calories: 70, protein: 2, carbs: 6, fat: 4, serving: "2 tbsp" },
  { name: "Peanut Butter Toast", calories: 270, protein: 11, carbs: 21, fat: 17, serving: "1 slice" },
  { name: "Banana with PB", calories: 295, protein: 9, carbs: 33, fat: 16, serving: "1 serving" },
  { name: "Mathri (2)", calories: 150, protein: 2, carbs: 16, fat: 9, serving: "2 pcs" },
  { name: "Namkeen/Mixture", calories: 160, protein: 4, carbs: 18, fat: 8, serving: "30g" },
  { name: "Bhel Puri", calories: 180, protein: 4, carbs: 28, fat: 6, serving: "1 plate" },
  { name: "Dhokla (3 pcs)", calories: 150, protein: 5, carbs: 22, fat: 5, serving: "3 pcs" },
  { name: "Khakhra (2)", calories: 120, protein: 4, carbs: 18, fat: 4, serving: "2 pcs" },

  // Desserts & Sweets
  { name: "Ice Cream (vanilla)", calories: 207, protein: 4, carbs: 24, fat: 11, serving: "1/2 cup" },
  { name: "Brownie", calories: 220, protein: 3, carbs: 28, fat: 11, serving: "1 piece" },
  { name: "Cookie (chocolate chip)", calories: 160, protein: 2, carbs: 22, fat: 8, serving: "1 cookie" },
  { name: "Cake (slice)", calories: 350, protein: 4, carbs: 45, fat: 17, serving: "1 slice" },
  { name: "Gulab Jamun (2)", calories: 300, protein: 3, carbs: 45, fat: 12, serving: "2 pcs" },
  { name: "Rasgulla (2)", calories: 180, protein: 4, carbs: 35, fat: 3, serving: "2 pcs" },
  { name: "Jalebi (2)", calories: 250, protein: 2, carbs: 45, fat: 8, serving: "2 pcs" },
  { name: "Ladoo (besan)", calories: 180, protein: 3, carbs: 20, fat: 10, serving: "1 pc" },
  { name: "Kheer", calories: 200, protein: 5, carbs: 30, fat: 7, serving: "150ml" },
  { name: "Halwa (sooji)", calories: 250, protein: 3, carbs: 35, fat: 12, serving: "100g" },

  // Cooking Oils & Fats
  { name: "Olive Oil", calories: 119, protein: 0, carbs: 0, fat: 14, serving: "1 tbsp" },
  { name: "Butter", calories: 102, protein: 0.1, carbs: 0, fat: 12, serving: "1 tbsp" },
  { name: "Ghee", calories: 120, protein: 0, carbs: 0, fat: 14, serving: "1 tbsp" },
  { name: "Coconut Oil", calories: 121, protein: 0, carbs: 0, fat: 14, serving: "1 tbsp" },

  // Condiments & Extras
  { name: "Honey", calories: 64, protein: 0.1, carbs: 17, fat: 0, serving: "1 tbsp" },
  { name: "Ketchup", calories: 20, protein: 0, carbs: 5, fat: 0, serving: "1 tbsp" },
  { name: "Mayonnaise", calories: 94, protein: 0.1, carbs: 0.1, fat: 10, serving: "1 tbsp" },
  { name: "Soy Sauce", calories: 9, protein: 1, carbs: 1, fat: 0, serving: "1 tbsp" },
  { name: "Raita", calories: 50, protein: 2, carbs: 5, fat: 2, serving: "50g" },
  { name: "Pickle (achaar)", calories: 30, protein: 0.5, carbs: 3, fat: 2, serving: "1 tbsp" },
  { name: "Chutney (green)", calories: 15, protein: 0.5, carbs: 2, fat: 0.5, serving: "1 tbsp" },
  { name: "Papad (roasted)", calories: 40, protein: 2, carbs: 6, fat: 1, serving: "1 pc" },

  // Complete Meals (approx)
  { name: "Thali (veg)", calories: 600, protein: 18, carbs: 80, fat: 22, serving: "1 thali" },
  { name: "Thali (non-veg)", calories: 750, protein: 35, carbs: 75, fat: 30, serving: "1 thali" },
  { name: "Meal Prep (chicken + rice)", calories: 450, protein: 35, carbs: 50, fat: 10, serving: "1 container" },
  { name: "Salad Bowl (protein)", calories: 380, protein: 30, carbs: 25, fat: 18, serving: "1 bowl" },
  { name: "Soup (lentil)", calories: 180, protein: 12, carbs: 25, fat: 3, serving: "1 bowl" },
  { name: "Soup (chicken)", calories: 150, protein: 12, carbs: 15, fat: 5, serving: "1 bowl" },
  { name: "Wrap (grilled chicken)", calories: 380, protein: 28, carbs: 35, fat: 14, serving: "1 wrap" },
  { name: "Bowl (poke/grain)", calories: 480, protein: 25, carbs: 55, fat: 16, serving: "1 bowl" },
];

// Workout templates
const WORKOUT_TEMPLATES = {
  push: {
    name: "Push Day",
    exercises: [
      "Bench Press",
      "Overhead Press",
      "Incline Dumbbell Press",
      "Lateral Raises",
      "Tricep Pushdown",
      "Cable Flies"
    ]
  },
  pull: {
    name: "Pull Day",
    exercises: [
      "Deadlift",
      "Barbell Row",
      "Pull-ups",
      "Face Pulls",
      "Bicep Curls",
      "Hammer Curls"
    ]
  },
  legs: {
    name: "Leg Day",
    exercises: [
      "Squat",
      "Romanian Deadlift",
      "Leg Press",
      "Lunges",
      "Leg Curl",
      "Calf Raises"
    ]
  },
  upper: {
    name: "Upper Body",
    exercises: [
      "Bench Press",
      "Barbell Row",
      "Overhead Press",
      "Pull-ups",
      "Lateral Raises",
      "Bicep Curls"
    ]
  },
  lower: {
    name: "Lower Body",
    exercises: [
      "Squat",
      "Romanian Deadlift",
      "Bulgarian Split Squat",
      "Leg Press",
      "Leg Curl",
      "Calf Raises"
    ]
  }
};

// Common exercise list for auto-suggest
const EXERCISES = [
  "Bench Press", "Incline Bench Press", "Decline Bench Press",
  "Dumbbell Press", "Incline Dumbbell Press",
  "Overhead Press", "Seated OHP", "Arnold Press",
  "Squat", "Front Squat", "Goblet Squat",
  "Deadlift", "Romanian Deadlift", "Sumo Deadlift",
  "Barbell Row", "Dumbbell Row", "Pendlay Row", "T-Bar Row",
  "Pull-ups", "Chin-ups", "Lat Pulldown",
  "Leg Press", "Hack Squat",
  "Lunges", "Bulgarian Split Squat", "Walking Lunges",
  "Leg Curl", "Leg Extension",
  "Calf Raises", "Seated Calf Raises",
  "Lateral Raises", "Front Raises", "Rear Delt Flies",
  "Face Pulls", "Cable Flies", "Chest Flies",
  "Bicep Curls", "Hammer Curls", "Preacher Curls", "Concentration Curls",
  "Tricep Pushdown", "Skull Crushers", "Overhead Tricep Extension",
  "Dips", "Cable Crossover",
  "Plank", "Russian Twists", "Hanging Leg Raises", "Ab Wheel",
  "Hip Thrust", "Glute Bridge",
  "Shrugs", "Farmer's Walk",
  "Running", "Cycling", "Swimming", "Jump Rope", "Stair Climber"
];

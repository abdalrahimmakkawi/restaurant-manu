export const DISH_TYPES = [
  'Appetizer',
  'Main Course',
  'Dessert',
  'Beverage',
  'Soup',
  'Salad',
  'Rice Dish',
  'Noodle Dish'
] as const;

export type DishType = typeof DISH_TYPES[number];

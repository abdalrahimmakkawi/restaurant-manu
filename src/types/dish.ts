export interface Dish {
  id: string;
  dishId: string;
  name: string;
  type: DishType;
  price: number;
  ingredients: string;
  introduction: string;
  photoUrl?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DishType {
  APPETIZER = "Appetizer",
  MAIN_COURSE = "Main Course",
  SOUP = "Soup",
  RICE_DISH = "Rice Dish",
  DESSERT = "Dessert",
  BEVERAGE = "Beverage",
  SNACK = "Snack"
}

export interface CreateDishRequest {
  dishId: string;
  name: string;
  type: DishType;
  price: number;
  ingredients: string;
  introduction: string;
  photoUrl?: string;
}

export interface UpdateDishRequest {
  name?: string;
  type?: DishType;
  price?: number;
  ingredients?: string;
  introduction?: string;
  photoUrl?: string;
}

export interface DishStats {
  totalDishes: number;
  totalValue: number;
  averagePrice: number;
  mostPopularType: string;
  typeDistribution: Record<string, number>;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  dishes: Dish[];
}

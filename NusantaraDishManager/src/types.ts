export enum DishType {
  APPETIZER = 'Appetizer',
  MAIN_COURSE = 'Main Course',
  DESSERT = 'Dessert',
  BEVERAGE = 'Beverage',
  SOUP = 'Soup',
  SALAD = 'Salad',
  RICE_DISH = 'Rice Dish',
  NOODLE_DISH = 'Noodle Dish',
}

export interface Dish {
  id: string;           // Firestore document ID
  dishId: string;       // Custom ID e.g. D001
  name: string;
  type: DishType;
  price: number;        // IDR
  ingredients: string;
  introduction: string;
  photoUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST   = 'list',
  GET    = 'get',
  WRITE  = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: { providerId?: string | null; email?: string | null }[];
  };
}

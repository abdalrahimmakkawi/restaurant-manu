import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sitjsjdprtukoesdikze.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdGpzamRwcnR1a29lc2Rpa3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNzc4NzUsImV4cCI6MjA5Mjc1Mzg3NX0.JE5THsOgpGnlt1FmtdVAymGk4IuInv6uaGkkgj3MuqI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string, displayName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
  
  if (error) throw error;
  
  // Create user record in database after successful auth
  if (data.user) {
    const { error: dbError } = await supabase
      .from('users')
      .insert([{
        id: data.user.id,
        email: data.user.email,
        display_name: displayName || data.user.email?.split('@')[0],
      }]);
    
    if (dbError) console.error('Database user creation error:', dbError);
  }
  
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};

// Database functions
export const getDishes = async () => {
  const { data, error } = await supabase
    .from('dishes')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const createDish = async (dish: any) => {
  console.log('Creating dish with data:', dish);
  
  // Ensure type is valid before sending
  if (!dish.type || dish.type.trim() === '') {
    throw new Error('Dish type is required and must be a valid value');
  }
  
  const dbDish = {
    name: dish.name,
    type: dish.type,
    price: parseFloat(dish.price),
    photo_url: dish.photoUrl,
    introduction: dish.introduction,
    ingredients: dish.ingredients,
    user_id: dish.user_id,
    dish_id: dish.dishId,
  };
  
  const { data, error } = await supabase
    .from('dishes')
    .insert([dbDish])
    .select('*');
  
  if (error) {
    console.error('Supabase insert error:', error);
    // Show user-friendly error for constraint violations
    if (error.message?.includes('dishes_type_check')) {
      throw new Error('Invalid dish type. Please select from the available options.');
    }
    throw error;
  }
  
  return data;
}

export const updateDish = async (id: string, updates: any) => {
  const dbUpdates: any = {
    name: updates.name,
    type: updates.type,
    price: updates.price,
    photo_url: updates.photoUrl,     // ✅ Convert photoUrl → photo_url
    introduction: updates.introduction,
    ingredients: updates.ingredients,
  }
  
  if (updates.dishId) {
    dbUpdates.dish_id = updates.dishId
  }
  
  // ❌ DON'T update: id, created_at, updated_at
  const { data, error } = await supabase
    .from('dishes')
    .update(dbUpdates)
    .eq('id', id)
    .select('*')
  
  if (error) throw error
  return data
}

export const deleteDish = async (id: string) => {
  const { error } = await supabase
    .from('dishes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

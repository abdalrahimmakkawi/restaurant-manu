import { createClient } from '@supabase/supabase-js'
import { Dish, DishType, CreateDishRequest, UpdateDishRequest, ImportResult } from '@/types/dish'

let supabase: ReturnType<typeof createClient> | null = null

const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required')
    }
    
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabase
}

export class DishService {
  static async getAllDishes(): Promise<Dish[]> {
    try {
      const client = getSupabaseClient()
      const { data, error } = await client
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data as any[]).map((dish: any) => ({
        ...dish,
        type: dish.type as DishType,
        createdAt: new Date(dish.created_at),
        updatedAt: new Date(dish.updated_at)
      }))
    } catch (error) {
      console.error('Error fetching dishes:', error)
      throw error
    }
  }

  static async getDishById(dishId: string): Promise<Dish | null> {
    try {
      const client = getSupabaseClient()
      const { data, error } = await client
        .from('dishes')
        .select('*')
        .eq('dish_id', dishId)
        .single()

      if (error) throw error

      const dish = data as any
      return {
        ...dish,
        type: dish.type as DishType,
        createdAt: new Date(dish.created_at),
        updatedAt: new Date(dish.updated_at)
      }
    } catch (error) {
      console.error('Error fetching dish:', error)
      return null
    }
  }

  static async searchDishes(query: string): Promise<Dish[]> {
    try {
      const client = getSupabaseClient()
      const { data, error } = await client
        .from('dishes')
        .select('*')
        .or(`name.ilike.%${query}%,dish_id.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data as any[]).map((dish: any) => ({
        ...dish,
        type: dish.type as DishType,
        createdAt: new Date(dish.created_at),
        updatedAt: new Date(dish.updated_at)
      }))
    } catch (error) {
      console.error('Error searching dishes:', error)
      throw error
    }
  }

  static async createDish(dishData: CreateDishRequest): Promise<Dish> {
    try {
      const client = getSupabaseClient()
      const { data, error } = await client
        .from('dishes')
        .insert([{
          dish_id: dishData.dishId,
          name: dishData.name,
          type: dishData.type,
          price: dishData.price,
          ingredients: dishData.ingredients,
          introduction: dishData.introduction,
          photo_url: dishData.photoUrl || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }] as any)
        .select()
        .single()

      if (error) throw error

      const dish = data as any
      return {
        ...dish,
        type: dish.type as DishType,
        createdAt: new Date(dish.created_at),
        updatedAt: new Date(dish.updated_at)
      }
    } catch (error) {
      console.error('Error creating dish:', error)
      throw error
    }
  }

  static async updateDish(dishId: string, dishData: UpdateDishRequest): Promise<Dish> {
    try {
      const client = getSupabaseClient()
      const updateData: any = {
        ...dishData,
        updated_at: new Date().toISOString()
      }

      if (dishData.photoUrl) {
        updateData.photo_url = dishData.photoUrl
      }

      const { data, error } = await client
        .from('dishes')
        .update(updateData)
        .eq('dish_id', dishId)
        .select()
        .single()

      if (error) throw error

      const dish = data as any
      return {
        ...dish,
        type: dish.type as DishType,
        createdAt: new Date(dish.created_at),
        updatedAt: new Date(dish.updated_at)
      }
    } catch (error) {
      console.error('Error updating dish:', error)
      throw error
    }
  }

  static async deleteDish(dishId: string): Promise<void> {
    try {
      const client = getSupabaseClient()
      const { error } = await client
        .from('dishes')
        .delete()
        .eq('dish_id', dishId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting dish:', error)
      throw error
    }
  }

  static async getDishStats(): Promise<any> {
    try {
      const client = getSupabaseClient()
      const { data: dishes, error } = await client
        .from('dishes')
        .select('type, price')

      if (error) throw error

      const totalDishes = dishes.length
      const totalValue = dishes.reduce((sum: number, dish: any) => sum + dish.price, 0)
      const averagePrice = totalDishes > 0 ? Math.round(totalValue / totalDishes) : 0

      // Count by type
      const typeCounts: Record<string, number> = {}
      dishes.forEach((dish: any) => {
        typeCounts[dish.type] = (typeCounts[dish.type] || 0) + 1
      })

      // Find most popular type
      let mostPopularType = '-'
      let maxCount = 0
      for (const [type, count] of Object.entries(typeCounts)) {
        if (count > maxCount) {
          maxCount = count
          mostPopularType = type
        }
      }

      return {
        totalDishes,
        totalValue,
        averagePrice,
        mostPopularType,
        typeDistribution: typeCounts
      }
    } catch (error) {
      console.error('Error getting stats:', error)
      throw error
    }
  }

  static async importDishesFromFile(content: string): Promise<ImportResult> {
    const lines = content.trim().split('\n')
    const dishes: Dish[] = []
    const errors: string[] = []
    let success = 0
    let failed = 0

    // Skip header if present
    const startIndex = lines[0].toLowerCase().includes('dish_id') ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      try {
        const parts = line.split(',').map(part => part.trim().replace(/"/g, ''))
        
        if (parts.length < 6) {
          errors.push(`Line ${i + 1}: Invalid format - expected 6 fields`)
          failed++
          continue
        }

        const [dishId, name, type, priceStr, ingredients, introduction] = parts
        const price = parseInt(priceStr)

        if (!dishId || !name || !type || isNaN(price) || !ingredients) {
          errors.push(`Line ${i + 1}: Missing required fields or invalid price`)
          failed++
          continue
        }

        if (!Object.values(DishType).includes(type as DishType)) {
          errors.push(`Line ${i + 1}: Invalid dish type "${type}"`)
          failed++
          continue
        }

        const dishData: CreateDishRequest = {
          dishId,
          name,
          type: type as DishType,
          price,
          ingredients,
          introduction: introduction || ''
        }

        const newDish = await this.createDish(dishData)
        dishes.push(newDish)
        success++
      } catch (error) {
        errors.push(`Line ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        failed++
      }
    }

    return {
      success,
      failed,
      errors,
      dishes
    }
  }

  static async loadSampleData(): Promise<Dish[]> {
    const sampleDishes: CreateDishRequest[] = [
      {
        dishId: "DISH001",
        name: "Nasi Goreng Special",
        type: DishType.RICE_DISH,
        price: 35000,
        ingredients: "Rice, eggs, chicken, vegetables, sweet soy sauce",
        introduction: "Traditional Indonesian fried rice with special spices"
      },
      {
        dishId: "DISH002", 
        name: "Sate Ayam Madura",
        type: DishType.MAIN_COURSE,
        price: 45000,
        ingredients: "Chicken, peanut sauce, rice cake, shallots",
        introduction: "Grilled chicken skewers with authentic Madura peanut sauce"
      },
      {
        dishId: "DISH003",
        name: "Soto Ayam",
        type: DishType.SOUP,
        price: 28000,
        ingredients: "Chicken, vermicelli, eggs, celery, fried shallots",
        introduction: "Traditional Indonesian chicken soup with aromatic spices"
      },
      {
        dishId: "DISH004",
        name: "Gado-Gado",
        type: DishType.APPETIZER,
        price: 25000,
        ingredients: "Mixed vegetables, tofu, tempeh, peanut sauce",
        introduction: "Indonesian salad with steamed vegetables and peanut dressing"
      },
      {
        dishId: "DISH005",
        name: "Rendang",
        type: DishType.MAIN_COURSE,
        price: 55000,
        ingredients: "Beef, coconut milk, chili, galangal, lemongrass",
        introduction: "Spicy beef slow-cooked in coconut milk and traditional spices"
      }
    ]

    const dishes: Dish[] = []
    for (const dishData of sampleDishes) {
      try {
        const dish = await this.createDish(dishData)
        dishes.push(dish)
      } catch (error) {
        console.error('Error creating sample dish:', error)
      }
    }

    return dishes
  }
}

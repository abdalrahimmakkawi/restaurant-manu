import {
  supabase, getCurrentUser,
  getDishes, createDish, updateDish as updateDishSupabase, deleteDish as deleteDishSupabase,
} from '../lib/supabase';
import { DISH_TYPES } from '../constants/dishTypes';
import { Dish, DishType } from '../types';

// ── SEED DATA ─────────────────────────────────────────────────────────────────
// 33 real Indonesian dishes from the recipe dataset, prices in IDR
export const SEED_DISHES: Omit<Dish, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  // Main Course
  { dishId:'D001', name:'Ayam Woku Manado',         type:DishType.MAIN_COURSE,    price:28000, photoUrl:'', introduction:'Ayam kampung dimasak dengan bumbu rempah khas Manado yang kaya akan daun kemangi dan cabe.',            ingredients:'ayam kampung, jeruk nipis, garam, kunyit, bawang merah, bawang putih, cabe merah, cabe rawit, kemiri, serai, daun salam, daun kemangi' },
  { dishId:'D002', name:'Ayam Goreng Tulang Lunak', type:DishType.MAIN_COURSE,    price:32000, photoUrl:'', introduction:'Ayam goreng presto yang tulangnya lunak, digoreng hingga kecoklatan renyah di luar.',                  ingredients:'ayam, serai, daun jeruk, bawang putih, biji ketumbar, laos, kunyit, kemiri, garam, air, minyak goreng' },
  { dishId:'D003', name:'Ayam Cabai Kawin',          type:DishType.MAIN_COURSE,    price:38000, photoUrl:'', introduction:'Ayam goreng dengan tumisan bumbu cabe merah dan hijau yang pedas dan menggugah selera.',                ingredients:'ayam, cabai hijau, cabai merah rawit, bawang putih, bawang merah, gula, garam, tomat merah, air, minyak goreng' },
  // Main Course
  { dishId:'D004', name:'Beef Teriyaki',             type:DishType.MAIN_COURSE,    price:48000, photoUrl:'', introduction:'Daging sapi iris dengan saus teriyaki manis gurih, disajikan dengan nasi putih hangat.',              ingredients:'daging sapi, bawang bombai, bawang putih, saus teriyaki, kecap manis, garam, lada, gula, penyedap' },
  { dishId:'D005', name:'Rendang Sapi',              type:DishType.MAIN_COURSE,    price:55000, photoUrl:'', introduction:'Rendang daging sapi dengan santan kental dan bumbu rempah yang kaya, dimasak hingga kering berwarna kecoklatan.',  ingredients:'daging sapi, santan kental, cabe merah, jahe, ketumbar, kapulaga, cengkeh, bunga lawang, pala, bawang merah, bawang putih, lengkuas, serai, daun jeruk, daun kunyit, garam' },
  { dishId:'D006', name:'Tongseng Daging Sapi',      type:DishType.MAIN_COURSE,    price:62000, photoUrl:'', introduction:'Tongseng sapi pedas dengan kuah santan ringan, dilengkapi dengan kol dan tomat segar.',               ingredients:'daging sapi, bawang merah, bawang putih, jahe, kunyit, kemiri, cabe merah, serai, daun salam, daun jeruk, cabe rawit, tomat, kol, santan, kecap manis' },
  // Main Course
  { dishId:'D007', name:'Gurame Saus Padang',        type:DishType.MAIN_COURSE,    price:35000, photoUrl:'', introduction:'Ikan gurame goreng garing disiram dengan saus padang yang pedas dan kaya rempah.',                    ingredients:'ikan gurame, bawang putih, bawang merah, cabai merah, cabai rawit, bawang bombai, saus tiram, saus tomat, garam, gula, lada, wortel, tomat' },
  { dishId:'D008', name:'Ikan Kembung Bakar',        type:DishType.MAIN_COURSE,    price:42000, photoUrl:'', introduction:'Ikan kembung segar dibakar di atas teflon dengan bumbu sederhana, disajikan dengan sambal kecap.',    ingredients:'ikan kembung, jeruk nipis, garam halus, lada, biji ketumbar, mentega' },
  { dishId:'D009', name:'Mujaer Asam Pedas Manis',   type:DishType.MAIN_COURSE,    price:48000, photoUrl:'', introduction:'Ikan mujaer goreng dengan saus asam pedas manis yang segar dan menggugah selera.',                    ingredients:'ikan mujaer, wortel, bawang bombai, bawang putih, cabai rawit, bawang merah, saus tomat, saus tiram, garam, merica, air, jahe, jeruk nipis' },
  // Main Course
  { dishId:'D010', name:'Lumpia Udang Kulit Tahu',   type:DishType.APPETIZER,   price:42000, photoUrl:'', introduction:'Lumpia berisi campuran udang dan ayam yang dibungkus kulit tahu, digoreng renyah.',                   ingredients:'ayam, udang, daun bawang, garam, gula, merica, kecap ikan, saus tiram, minyak wijen, tepung sagu, tepung terigu, telur, kembang tahu' },
  { dishId:'D011', name:'Bakso Ayam Udang',           type:DishType.APPETIZER,   price:50000, photoUrl:'', introduction:'Bakso kenyal dan gurih dari campuran ayam giling dan udang, cocok untuk semua kalangan.',             ingredients:'ayam giling, udang kupas, telur ayam, minyak goreng, baking powder, garam, lada, bawang goreng, bawang merah, bawang putih, minyak wijen' },
  { dishId:'D012', name:'Udang Pop Corn Crispy',      type:DishType.APPETIZER,   price:55000, photoUrl:'', introduction:'Udang dibalut tepung krispy dan digoreng hingga renyah seperti popcorn, cocok sebagai cemilan.',      ingredients:'udang basah, tepung ayam super crispy, air matang, minyak goreng' },
  // Main Course
  { dishId:'D013', name:'Orek Tempe Manis Pedas',    type:DishType.MAIN_COURSE,   price:12000, photoUrl:'', introduction:'Tempe goreng dioseng dengan bumbu kecap manis pedas, cocok sebagai lauk pendamping nasi.',            ingredients:'tempe, cabe gendot, cabe keriting, cabe rawit merah, bawang merah, bawang putih, kecap, saus tiram, saus tomat, kaldu bubuk, garam, gula' },
  { dishId:'D014', name:'Terik Ayam Tempe Telor',    type:DishType.MAIN_COURSE,   price:15000, photoUrl:'', introduction:'Masakan berkuah santan dengan perpaduan ayam, tempe, dan telur yang kaya bumbu rempah.',              ingredients:'sayap ayam, telur, tempe, bawang merah, bawang putih, kemiri, ketumbar, garam, lengkuas, daun salam, serai, gula jawa, santan, air, cabe rawit' },
  { dishId:'D015', name:'Penyet Tempe Sambel Korek', type:DishType.MAIN_COURSE,   price:18000, photoUrl:'', introduction:'Tempe goreng kering dipencet di atas sambal korek yang pedas, dilengkapi daun kemangi segar.',        ingredients:'tempe, daun kemangi, cabe rawit, bawang putih, gula, garam, minyak goreng' },
  // Main Course
  { dishId:'D016', name:'Martabak Tahu Pedas',        type:DishType.APPETIZER,    price:10000, photoUrl:'', introduction:'Martabak isi tahu yang pedas dan gurih dibungkus kulit lumpia renyah, cocok untuk camilan.',          ingredients:'kulit lumpia, tahu putih, daun bawang, daun seledri, telur, tepung terigu, bawang putih, lada, garam, gula, cabe merah' },
  { dishId:'D017', name:'Batagor Ala Rumahan',        type:DishType.APPETIZER,    price:13000, photoUrl:'', introduction:'Bakso tahu goreng rumahan anti gagal, disajikan dengan saus kacang dan kecap manis.',                 ingredients:'tahu kuning, tepung terigu, mentega, bawang putih, garam, merica, air, saus cabe, cabe rawit, kecap' },
  { dishId:'D018', name:'Sop Tahu Ceker',             type:DishType.SOUP,    price:16000, photoUrl:'', introduction:'Sup hangat dengan ceker ayam, tahu kuning goreng, dan aneka sayuran dalam kuah bening yang gurih.',  ingredients:'ceker ayam, wortel, kol, daun bawang, seledri, tahu kuning, garam, gula, penyedap, lada, jeruk nipis, bawang putih, bawang merah' },
  // Main Course
  { dishId:'D019', name:'Orak Arik Telur Buncis',    type:DishType.MAIN_COURSE,   price:12000, photoUrl:'', introduction:'Tumisan telur orak arik dengan buncis segar, dimasak dengan bumbu sederhana dan kecap manis.',        ingredients:'telur, buncis, bawang merah, bawang putih, cabe rawit, kecap manis, garam, gula, penyedap' },
  { dishId:'D020', name:'Telur Kornet Goreng',        type:DishType.MAIN_COURSE,   price:15000, photoUrl:'', introduction:'Perpaduan kornet kaleng dengan telur, digoreng menjadi lauk sederhana yang lezat dan mudah dibuat.', ingredients:'kornet kaleng, bawang prei, telur, tepung terigu, cabe rawit, garam, merica, saus tiram' },
  { dishId:'D021', name:'Tahu Telur Surabaya',        type:DishType.MAIN_COURSE,   price:20000, photoUrl:'', introduction:'Tahu dan telur goreng khas Surabaya dengan saus petis kacang yang gurih dan lezat.',                 ingredients:'telur, tahu putih goreng, bawang putih goreng, petis udang, kacang tanah, gula merah, kucai, bawang goreng, kecap manis, cabai rawit, tauge' },
  // Main Course
  { dishId:'D022', name:'Sate Kambing',               type:DishType.MAIN_COURSE, price:52000, photoUrl:'', introduction:'Sate kambing muda yang empuk dibakar dengan arang, disajikan dengan sambal kecap dan lalapan.',      ingredients:'daging kambing, daun pepaya, bawang merah, bawang putih, jahe, ketumbar, lada, garam, asam jawa, kecap manis, cabe rawit, tomat, jeruk limau' },
  { dishId:'D023', name:'Rabeg Kambing',               type:DishType.MAIN_COURSE, price:58000, photoUrl:'', introduction:'Masakan khas Banten dari daging kambing dengan bumbu rempah lengkap dan kecap manis.',               ingredients:'daging kambing paha, cabe, bawang putih, bawang merah, kemiri, jahe, kunyit, klabet, jinten, serai, daun salam, kayu manis, cengkeh, kapulaga, kecap manis, garam, gula' },
  { dishId:'D024', name:'Gulai Kambing',               type:DishType.MAIN_COURSE, price:65000, photoUrl:'', introduction:'Gulai kambing berkuah santan kuning yang kaya rempah, khas masakan Padang yang lezat dan harum.',    ingredients:'daging kambing, santan, serai, daun salam, daun jeruk, cabe, cengkeh, bawang merah, bawang putih, kemiri, kunyit, jahe, lengkuas, ketumbar, merica, pala, garam, gula' },
  // Beverage
  { dishId:'D025', name:'Es Teh Manis',               type:DishType.BEVERAGE, price:5000,  photoUrl:'', introduction:'Teh manis segar dengan es batu, minuman wajib pelengkap makan yang menyegarkan.',                   ingredients:'teh celup, gula pasir, es batu, air matang' },
  { dishId:'D026', name:'Es Jeruk Segar',             type:DishType.BEVERAGE, price:8000,  photoUrl:'', introduction:'Perasan jeruk nipis segar dicampur gula dan es batu, minuman segar yang menyehatkan.',              ingredients:'jeruk nipis, gula pasir, es batu, air mineral' },
  { dishId:'D027', name:'Jus Alpukat',                type:DishType.BEVERAGE, price:15000, photoUrl:'', introduction:'Jus alpukat lembut dan creamy dengan susu kental manis, minuman favorit yang mengenyangkan.',        ingredients:'alpukat matang, susu kental manis, es batu, gula pasir' },
  // Dessert
  { dishId:'D028', name:'Klepon Pandan',              type:DishType.DESSERT,     price:8000,  photoUrl:'', introduction:'Kue tradisional bulat dari tepung ketan isi gula merah cair, dibalut kelapa parut harum.',           ingredients:'tepung ketan, gula merah, kelapa parut, pewarna pandan, garam, air' },
  { dishId:'D029', name:'Martabak Manis Spesial',     type:DishType.DESSERT,     price:35000, photoUrl:'', introduction:'Martabak tebal dan lembut dengan isi coklat, keju, dan topping pilihan yang melimpah.',              ingredients:'tepung terigu, telur, gula, ragi, susu, mentega, coklat meises, keju parut, butter' },
  { dishId:'D030', name:'Pisang Goreng Crispy',       type:DishType.DESSERT,     price:10000, photoUrl:'', introduction:'Pisang kepok dibalut adonan tepung renyah dan digoreng keemasan, cocok untuk cemilan sore.',         ingredients:'pisang kepok, tepung terigu, tepung beras, gula pasir, vanili, minyak goreng' },
  // Rice Dish
  { dishId:'D031', name:'Nasi Putih',                 type:DishType.RICE_DISH,    price:5000,  photoUrl:'', introduction:'Nasi putih pulen matang yang menjadi pendamping wajib dari setiap lauk masakan.',                   ingredients:'beras pulen, air, garam sedikit' },
  { dishId:'D032', name:'Nasi Goreng Spesial',        type:DishType.RICE_DISH,    price:25000, photoUrl:'', introduction:'Nasi goreng dengan telur, bumbu lengkap, dan kecap manis, sajian sarapan atau makan malam andalan.',  ingredients:'nasi putih, telur, bawang merah, bawang putih, kecap manis, cabe rawit, garam, penyedap, minyak goreng, bawang goreng, kerupuk' },
  { dishId:'D033', name:'Nasi Uduk Betawi',           type:DishType.RICE_DISH,    price:18000, photoUrl:'', introduction:'Nasi dimasak dengan santan dan rempah khas Betawi, harum dan gurih, disajikan dengan lauk pelengkap.', ingredients:'beras, santan, serai, daun salam, daun pandan, garam, bawang goreng' },
];

// ── SERVICE ───────────────────────────────────────────────────────────────────
export const dishService = {

  subscribeToDishes(callback: (dishes: Dish[]) => void) {
    let isSubscribed = true;
    
    const loadDishes = async () => {
      try {
        const user = await getCurrentUser();
        if (!user || !isSubscribed) { 
          callback([]); 
          return; 
        }
        
        const dishes = await getDishes();
        if (isSubscribed) {
          callback(dishes.map(dish => ({
            id: dish.id,
            name: dish.name,
            type: dish.type,
            price: dish.price,
            photoUrl: dish.photo_url,        // ✅ Convert snake_case → camelCase
            introduction: dish.introduction,
            ingredients: dish.ingredients,
            userId: dish.user_id,
            dishId: dish.dish_id,
            createdAt: dish.created_at ? new Date(dish.created_at) : null,
            updatedAt: dish.updated_at ? new Date(dish.updated_at) : null,
          })) as Dish[]);
        }
      } catch (error) {
        console.error('Error loading dishes:', error);
        if (isSubscribed) callback([]);
      }
    };

    loadDishes();
    
    // Set up polling for real-time updates
    const interval = setInterval(loadDishes, 5000);
    
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  },

  async addDish(dish: Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    // Validate dish type before sending to database
    if (!DISH_TYPES.includes(dish.type as any)) {
      throw new Error(`Invalid dish type: ${dish.type}. Allowed values: ${DISH_TYPES.join(', ')}`);
    }
    
    const dishWithUser = {
      ...dish,
      user_id: user.id,                   // ✅ Ensure user_id is set
    }
    return await createDish(dishWithUser)
  },

  async updateDish(id: string, updates: Partial<Omit<Dish, 'id' | 'userId' | 'createdAt'>>) {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return updateDishSupabase(id, updateData);
  },

  async deleteDish(id: string) {
    return deleteDishSupabase(id);
  },

  // Seed the 33 real Indonesian dishes for a new user
  async seedDishes() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    const promises = SEED_DISHES.map(dish =>
      createDish({
        ...dish,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );
    await Promise.all(promises);
  },
};

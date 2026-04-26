# Nusantara Dish Manager - Web Version

A modern Indonesian restaurant management system built with Next.js and Supabase, ready for Vercel deployment.

## 🚀 Features

- **Modern Dashboard** - Real-time statistics and overview
- **Dish Management** - Full CRUD operations for menu items
- **Analytics** - Type distribution and financial insights
- **Import/Export** - Bulk data management
- **Responsive Design** - Works on all devices
- **Real-time Updates** - Live data synchronization

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
4. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the following SQL in your Supabase SQL Editor:

```sql
-- Create dishes table
CREATE TABLE IF NOT EXISTS public.dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dish_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Appetizer', 'Main Course', 'Soup', 'Rice Dish', 'Dessert', 'Beverage', 'Snack')),
    price INTEGER NOT NULL CHECK (price > 0),
    ingredients TEXT DEFAULT '',
    introduction TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dishes_dish_id ON public.dishes(dish_id);
CREATE INDEX IF NOT EXISTS idx_dishes_type ON public.dishes(type);
CREATE INDEX IF NOT EXISTS idx_dishes_created_at ON public.dishes(created_at DESC);

-- Enable Row Level Security (optional)
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## 📱 Usage

1. **Dashboard** - View statistics and recent activity
2. **Add Dishes** - Create new menu items with details
3. **Manage Dishes** - Edit, delete, and organize existing dishes
4. **Analytics** - View detailed reports and insights
5. **Import Data** - Bulk import from CSV/Excel files

## 🎨 Customization

### Colors and Theme

The app uses Tailwind CSS with custom CSS variables. You can customize the theme by modifying the CSS variables in `src/app/globals.css`.

### Components

All UI components are built with shadcn/ui and can be found in `src/components/ui/`.

## 📄 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── Dashboard.tsx     # Main dashboard
├── lib/                  # Utilities and services
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
    └── dish.ts           # Dish types
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create components in `src/components/`
2. Add types in `src/types/`
3. Update services in `src/lib/`
4. Add pages in `src/app/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the example implementations

---

**Built with ❤️ for Indonesian restaurants**

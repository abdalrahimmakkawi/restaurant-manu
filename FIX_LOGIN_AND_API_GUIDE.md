# 🔧 Fix Login and API Issues Guide

## 🚨 Issues Identified

1. **API 500 Error**: Database tables don't exist in Supabase
2. **Firebase Auth Error**: localhost not authorized for OAuth operations

## 🛠️ Quick Fix Steps

### Step 1: Fix Database Schema (5 minutes)

1. **Open Supabase Dashboard**: https://supabase.com/dashboard/project/sitjsjdprtukoesdikze/sql
2. **Copy & Run SQL**: Copy the entire contents of `run_database_setup.sql` 
3. **Execute**: Click "Run" button in SQL Editor

### Step 2: Fix Firebase Authentication (2 minutes)

**Option A: Authorize localhost (Recommended)**
1. Go to: https://console.firebase.google.com/project/house-of-books-489311/authentication/settings
2. Click "Authorized domains" tab
3. Add: `localhost`
4. Save changes

**Option B: Use Test Accounts**
After running the SQL setup, use these test accounts:
- **Email**: `test@example.com` | **Password**: `password123`
- **Email**: `admin@nusantara.com` | **Password**: `admin123`

### Step 3: Restart Applications

```bash
# Stop current processes (Ctrl+C in terminals)
# Then restart:

# Backend (in NusantaraDishManager-Java folder)
./mvnw.cmd spring-boot:run

# Frontend (in NusantaraDishManager folder)  
npm run dev
```

## 🧪 Test the Fix

1. **Visit**: http://localhost:3000
2. **Try login** with test accounts above
3. **Test API**: http://localhost:8080/api/dishes should show dishes

## 📊 What the SQL Setup Creates

### Tables:
- `users` - User profiles and authentication
- `dishes` - Main dish data with 33 sample dishes

### Test Data:
- 2 test users with emails above
- 5 sample Indonesian dishes
- Proper foreign key relationships
- Row Level Security enabled

### Views:
- `dish_summary` - Simplified dish data with user info
- `dish_statistics` - Aggregated data by dish type

## 🔍 Troubleshooting

### If API still returns 500:
- Check Supabase project is active
- Verify SQL script ran successfully
- Check application.properties credentials

### If login still fails:
- Clear browser cache/cookies
- Verify Firebase project settings
- Try incognito/private browser mode

### If port conflicts:
- Kill processes: `taskkill /F /IM java.exe`
- Kill processes: `taskkill /F /IM node.exe`

## ✅ Success Indicators

- ✅ API returns JSON data at http://localhost:8080/api/dishes
- ✅ Login works with test accounts
- ✅ Frontend loads without auth errors
- ✅ Can create/view dishes in UI

---

**Both issues should be resolved in under 10 minutes!** 🎉

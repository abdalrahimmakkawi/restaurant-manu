# 🔧 Quick Fix for Login Issues

## 🚨 Current Problem
- You confirmed email but can't login
- API returns 500 errors (database schema missing)
- User exists in Supabase Auth but not in database

## ⚡ Immediate Fix (2 minutes)

### Step 1: Run Database Setup
1. **Open**: https://supabase.com/dashboard/project/sitjsjdprtukoesdikze/sql
2. **Copy**: All content from `run_database_setup.sql`
3. **Paste & Run**: Click "Run" button

### Step 2: Test with Pre-created Accounts
After running SQL, use these accounts:
- **Email**: `test@example.com` | **Password**: `password123`
- **Email**: `admin@nusantara.com` | **Password**: `admin123`

## 🔍 Why This Happens

1. **Supabase Auth vs Database**: Email confirmation creates auth user, but no database record
2. **Missing Tables**: Backend can't connect to non-existent tables
3. **Schema Mismatch**: Auth users need corresponding database users

## 🛠️ Alternative: Fix Auth Flow

If you want to use your confirmed email account:

1. **Add user to database manually**:
```sql
INSERT INTO users (id, email, display_name) 
VALUES ('YOUR_AUTH_USER_ID', 'your@email.com', 'Your Name');
```

2. **Get your user ID**: Check browser console after login attempt

## ✅ Expected Result After Fix

- ✅ API returns data at http://localhost:8080/api/dishes
- ✅ Login works with test accounts
- ✅ Can create/view dishes in UI
- ✅ No more 500 errors

## 🚀 Next Steps

1. Run the SQL setup script now
2. Try login with test accounts
3. If still issues, check browser console for specific errors

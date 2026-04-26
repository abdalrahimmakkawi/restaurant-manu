# 🚀 Nusantara Dish Manager - Setup & Run Instructions

## 📋 What You Need to Do

### 1. Get Your Supabase Database Password

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `sitjsjdprtukoesdikze`
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string**
5. Copy the password from the connection string
6. Update the password in `src/main/resources/application.properties`

**Example:** If your connection string shows:
```
postgresql://postgres:YOUR_PASSWORD@sitjsjdprtukoesdikze.supabase.co:5432/postgres
```
Then update `application.properties` line 16:
```properties
spring.datasource.password=YOUR_PASSWORD
```

### 2. Install Java (if not installed)

1. Download Java 17+ from: https://adoptium.net/
2. Install and restart your terminal

### 3. Run the Application

Now you can use the Maven wrapper (no Maven installation needed):

```bash
cd NusantaraDishManager-Java
.\mvnw.cmd spring-boot:run
```

**Alternative (if you have Maven installed):**
```bash
mvn spring-boot:run
```

### 4. Test the API

Once running, test these endpoints:

```bash
# Get all dishes
curl http://localhost:8080/api/dishes

# Search for chicken dishes
curl "http://localhost:8080/api/dishes/search?query=ayam"

# Get statistics
curl http://localhost:8080/api/dishes/statistics
```

## 🔧 Troubleshooting

### "mvn not recognized" error
- Use `.\mvnw.cmd` instead of `mvn`
- This works without installing Maven

### Database connection error
- Verify your Supabase password is correct
- Check that your Supabase project is active
- Ensure you ran the SQL setup script first

### Java not found error
- Install Java 17+ from https://adoptium.net/
- Set JAVA_HOME environment variable

### Port 8080 already in use
- Change port in `application.properties`:
```properties
server.port=8081
```

## 📱 API Documentation

Once running, visit: http://localhost:8080/api/dishes

### Main Endpoints:
- `GET /api/dishes` - All dishes
- `POST /api/dishes` - Create dish
- `PUT /api/dishes/{id}` - Update dish
- `DELETE /api/dishes/{id}` - Delete dish
- `GET /api/dishes/search?query={term}` - Search
- `GET /api/dishes/statistics` - Analytics

## 🎯 Quick Test

Create a test dish:
```bash
curl -X POST http://localhost:8080/api/dishes \
  -H "Content-Type: application/json" \
  -d '{
    "dishId": "D034",
    "name": "Test Dish",
    "type": "AYAM",
    "price": 25000.00,
    "ingredients": "ayam, bumbu",
    "introduction": "Test dish description",
    "photoUrl": ""
  }'
```

## 📞 Support

If you encounter issues:
1. Check Java installation: `java -version`
2. Verify database password in application.properties
3. Check Supabase project status
4. Look at application logs for errors

---

**Ready to run! 🍽️**

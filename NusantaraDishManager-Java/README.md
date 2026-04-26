# Nusantara Dish Manager - Java Spring Boot API

## 🍽️ Dish Information Management System

Java Spring Boot REST API for managing Indonesian cuisine dishes with Supabase PostgreSQL database.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Supabase account with database set up

### Setup Instructions

1. **Clone and Navigate**
```bash
cd NusantaraDishManager-Java
```

2. **Update Database Credentials**
Edit `src/main/resources/application.properties`:
```properties
# Update these with your actual Supabase credentials
supabase.url=https://your-project-id.supabase.co
supabase.anon-key=your-anon-key
spring.datasource.password=your-db-password
```

3. **Run the Application**
```bash
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080/api`

## 📡 API Endpoints

### Dishes Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dishes` | Get all dishes for current user |
| GET | `/api/dishes/paged` | Get paginated dishes |
| GET | `/api/dishes/{id}` | Get specific dish |
| GET | `/api/dishes/by-dish-id/{dishId}` | Get dish by custom ID |
| POST | `/api/dishes` | Create new dish |
| PUT | `/api/dishes/{id}` | Update existing dish |
| DELETE | `/api/dishes/{id}` | Delete dish |

### Search & Filter

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dishes/search?query={term}` | Full-text search |
| GET | `/api/dishes/search/name?name={name}` | Search by name |
| GET | `/api/dishes/type/{type}` | Filter by dish type |
| GET | `/api/dishes/price-range?min={min}&max={max}` | Filter by price range |
| GET | `/api/dishes/sort/price?order={asc|desc}` | Sort by price |
| GET | `/api/dishes/sort/name` | Sort by name |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dishes/statistics` | Get price statistics |
| GET | `/api/dishes/statistics/by-type` | Get count by type |
| GET | `/api/dishes/count` | Get total dish count |
| GET | `/api/dishes/types` | Get all dish types |

### Users Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get specific user |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

## 📝 Example API Usage

### Create a New Dish
```bash
curl -X POST http://localhost:8080/api/dishes \
  -H "Content-Type: application/json" \
  -d '{
    "dishId": "D034",
    "name": "Sate Ayam Madura",
    "type": "AYAM",
    "price": 35000.00,
    "ingredients": "ayam, kecap, bawang merah, bawang putih",
    "introduction": "Sate ayam khas Madura dengan bumbu kecap manis",
    "photoUrl": ""
  }'
```

### Search Dishes
```bash
curl "http://localhost:8080/api/dishes/search?query=ayam"
```

### Get Dishes by Type
```bash
curl "http://localhost:8080/api/dishes/type/AYAM"
```

### Get Statistics
```bash
curl "http://localhost:8080/api/dishes/statistics"
```

## 🍜 Dish Types

The system supports 11 Indonesian dish categories:

- **AYAM** - Chicken dishes
- **SAPI** - Beef dishes  
- **IKAN** - Fish dishes
- **UDANG** - Shrimp dishes
- **TEMPE** - Tempeh dishes
- **TAHU** - Tofu dishes
- **TELUR** - Egg dishes
- **KAMBING** - Goat dishes
- **MINUMAN** - Beverages
- **KUE** - Cakes & Desserts
- **NASI** - Rice dishes

## 💾 Database Schema

### Users Table
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique email
- `display_name` (VARCHAR) - User display name
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Last update

### Dishes Table
- `id` (UUID) - Primary key
- `dish_id` (VARCHAR) - Custom ID (D001, D002, etc.)
- `name` (VARCHAR) - Dish name
- `type` (VARCHAR) - Dish category
- `price` (DECIMAL) - Price in IDR
- `ingredients` (TEXT) - Comma-separated ingredients
- `introduction` (TEXT) - Dish description
- `photo_url` (TEXT) - Image URL
- `user_id` (UUID) - Foreign key to users
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Last update

## 🔧 Configuration

Key configuration in `application.properties`:

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Supabase
supabase.url=https://your-project.supabase.co
supabase.anon-key=your-anon-key

# Database
spring.datasource.url=jdbc:postgresql://your-project.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your-password

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```

## 🧪 Testing

Run unit tests:
```bash
mvn test
```

Run integration tests:
```bash
mvn verify
```

## 📊 Sample Data

The database includes 33 authentic Indonesian dishes across all categories, priced in Indonesian Rupiah (IDR).

## 🔒 Security

- Row Level Security (RLS) enabled in Supabase
- Users can only access their own dishes
- Input validation on all endpoints
- CORS enabled for cross-origin requests

## 🚀 Deployment

### Docker
```bash
docker build -t nusantara-dish-manager .
docker run -p 8080:8080 nusantara-dish-manager
```

### Cloud Deployment
- Compatible with AWS, Google Cloud, Azure
- Requires environment variables for database credentials
- Supports horizontal scaling

## 📞 Support

For issues and questions:
1. Check the API documentation above
2. Verify database connection
3. Check application logs
4. Ensure Supabase RLS policies are correctly configured

---

**Built with ❤️ for Indonesian cuisine management**

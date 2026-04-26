# Supabase Setup Instructions for Nusantara Dish Manager

## 🚀 Quick Setup Guide

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run SQL Scripts in Supabase Dashboard

#### Step 1: Create Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase_schema.sql`
4. Click **Run** to execute

#### Step 2: Insert Sample Data (Optional)
1. First create a test user in the `users` table:
```sql
INSERT INTO users (email, display_name) VALUES ('test@example.com', 'Test User');
```

2. Get the user ID:
```sql
SELECT id FROM users WHERE email = 'test@example.com';
```

3. Update `seed_data.sql` - replace `YOUR_USER_UUID` with the actual UUID from step 2
4. Run the updated seed data script

### 3. Configure Java Application

Add these dependencies to your `pom.xml`:

```xml
<dependencies>
    <!-- Supabase Java Client -->
    <dependency>
        <groupId>io.supabase</groupId>
        <artifactId>supabase-java</artifactId>
        <version>1.2.0</version>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.7.3</version>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
</dependencies>
```

### 4. Application Properties

In `application.properties`:

```properties
# Supabase Configuration
supabase.url=https://your-project-id.supabase.co
supabase.anon-key=your-anon-key
supabase.service-role-key=your-service-role-key

# PostgreSQL Direct Connection (for admin operations)
spring.datasource.url=jdbc:postgresql://your-project-id.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your-db-password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### 5. Database Schema Overview

#### Tables Created:
- **users**: User authentication and profiles
- **dishes**: Main dish data with all fields

#### Key Features:
- Row Level Security (RLS) enabled
- UUID primary keys
- Automatic timestamp updates
- Full-text search on dish names
- Price validation (non-negative)
- Type constraints (11 dish categories)

#### Views Available:
- **dish_summary**: Simplified view with user info
- **dish_statistics**: Aggregated data by type

### 6. API Endpoints (Java Spring Boot)

Your Java application should expose these endpoints:

```
GET    /api/dishes              # Get all dishes for authenticated user
POST   /api/dishes              # Create new dish
GET    /api/dishes/{id}         # Get specific dish
PUT    /api/dishes/{id}         # Update dish
DELETE /api/dishes/{id}         # Delete dish
GET    /api/dishes/search       # Search dishes by name
GET    /api/dishes/statistics   # Get dish statistics by type
```

### 7. Data Types Reference

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| dish_id | VARCHAR(20) | Custom ID like D001, D002 |
| name | VARCHAR(255) | Dish name |
| type | VARCHAR(50) | One of 11 categories |
| price | DECIMAL(10,2) | Price in IDR |
| ingredients | TEXT | Comma-separated ingredients |
| introduction | TEXT | Dish description |
| photo_url | TEXT | Image URL (optional) |
| user_id | UUID | Foreign key to users table |

### 8. Dish Categories

Valid values for `type` field:
- Ayam (Chicken)
- Sapi (Beef) 
- Ikan (Fish)
- Udang (Shrimp)
- Tempe (Tempeh)
- Tahu (Tofu)
- Telur (Egg)
- Kambing (Goat)
- Minuman (Beverages)
- Kue (Cakes/Desserts)
- Nasi (Rice)

### 9. Testing the Setup

1. Create a test user via authentication
2. Insert sample dishes using the seed data
3. Test API endpoints with Postman/curl
4. Verify RLS policies work correctly

### 10. Migration Notes

- From Firebase: Document IDs become UUID primary keys
- From Firebase: Subcollections flattened into relational tables
- From Firebase: Timestamps converted to PostgreSQL TIMESTAMPS
- Added proper foreign key constraints
- Added check constraints for data integrity
- Implemented Row Level Security for multi-tenancy

---

**Ready for Java Development!** 🎉

Your Supabase database is now set up and ready for the Java Spring Boot application development.

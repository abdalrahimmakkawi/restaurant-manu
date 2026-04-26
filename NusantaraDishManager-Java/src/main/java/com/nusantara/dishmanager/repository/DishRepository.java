package com.nusantara.dishmanager.repository;

import com.nusantara.dishmanager.entity.Dish;
import com.nusantara.dishmanager.entity.Dish.DishType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DishRepository extends JpaRepository<Dish, UUID> {
    
    // Find by user ID
    List<Dish> findByUserId(UUID userId);
    Page<Dish> findByUserId(UUID userId, Pageable pageable);
    
    // Find by dish ID and user
    Optional<Dish> findByDishIdAndUserId(String dishId, UUID userId);
    
    // Find by type and user
    List<Dish> findByTypeAndUserId(DishType type, UUID userId);
    
    // Search by name (case insensitive) and user
    @Query("SELECT d FROM Dish d WHERE d.user.id = :userId AND LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Dish> findByNameContainingAndUserId(@Param("name") String name, @Param("userId") UUID userId);
    
    // Find by price range and user
    @Query("SELECT d FROM Dish d WHERE d.user.id = :userId AND d.price BETWEEN :minPrice AND :maxPrice")
    List<Dish> findByPriceRangeAndUserId(@Param("minPrice") BigDecimal minPrice, 
                                        @Param("maxPrice") BigDecimal maxPrice, 
                                        @Param("userId") UUID userId);
    
    // Count dishes by type for a user
    @Query("SELECT d.type, COUNT(d) FROM Dish d WHERE d.user.id = :userId GROUP BY d.type")
    List<Object[]> countDishesByTypeForUser(@Param("userId") UUID userId);
    
    // Get statistics for a user
    @Query("SELECT COUNT(d), AVG(d.price), MIN(d.price), MAX(d.price) FROM Dish d WHERE d.user.id = :userId")
    Object[] getDishStatisticsForUser(@Param("userId") UUID userId);
    
    // Check if dish ID exists for user
    boolean existsByDishIdAndUserId(String dishId, UUID userId);
    
    // Find all dishes ordered by price for a user
    List<Dish> findByUserIdOrderByPriceAsc(UUID userId);
    List<Dish> findByUserIdOrderByPriceDesc(UUID userId);
    
    // Find all dishes ordered by name for a user
    List<Dish> findByUserIdOrderByNameAsc(UUID userId);
    
    // Full text search
    @Query("SELECT d FROM Dish d WHERE d.user.id = :userId AND " +
           "(LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.introduction) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.ingredients) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Dish> fullTextSearchForUser(@Param("searchTerm") String searchTerm, @Param("userId") UUID userId);
}

package com.nusantara.dishmanager.controller;

import com.nusantara.dishmanager.dto.DishDto;
import com.nusantara.dishmanager.entity.Dish.DishType;
import com.nusantara.dishmanager.service.DishService;
import com.nusantara.dishmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/dishes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class DishController {
    
    private final DishService dishService;
    private final UserRepository userRepository;
    
    // Get first available user ID dynamically
    private UUID getCurrentUserId() {
        List<com.nusantara.dishmanager.entity.User> users = userRepository.findAll();
        if (users.isEmpty()) {
            // Create a default user if none exists
            com.nusantara.dishmanager.entity.User defaultUser = com.nusantara.dishmanager.entity.User.builder()
                    .email("default@example.com")
                    .displayName("Default User")
                    .build();
            defaultUser = userRepository.save(defaultUser);
            return defaultUser.getId();
        }
        return users.get(0).getId();
    }
    
    @GetMapping
    public ResponseEntity<List<DishDto>> getAllDishes() {
        UUID userId = getCurrentUserId();
        log.info("Getting all dishes for user: {}", userId);
        List<DishDto> dishes = dishService.getAllDishesForUser(userId);
        return ResponseEntity.ok(dishes);
    }
    
    @GetMapping("/paged")
    public ResponseEntity<Page<DishDto>> getAllDishesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        UUID userId = getCurrentUserId();
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<DishDto> dishes = dishService.getAllDishesForUser(userId, pageable);
        return ResponseEntity.ok(dishes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DishDto> getDishById(@PathVariable UUID id) {
        return dishService.getDishById(id)
                .map(dish -> ResponseEntity.ok(dish))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/by-dish-id/{dishId}")
    public ResponseEntity<DishDto> getDishByDishId(@PathVariable String dishId) {
        UUID userId = getCurrentUserId();
        return dishService.getDishByDishId(dishId, userId)
                .map(dish -> ResponseEntity.ok(dish))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<DishDto> createDish(@RequestBody DishDto dishDto) {
        try {
            UUID userId = getCurrentUserId();
            DishDto createdDish = dishService.createDish(dishDto, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDish);
        } catch (RuntimeException e) {
            log.error("Error creating dish: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DishDto> updateDish(@PathVariable UUID id, @RequestBody DishDto dishDto) {
        try {
            UUID userId = getCurrentUserId();
            DishDto updatedDish = dishService.updateDish(id, dishDto, userId);
            return ResponseEntity.ok(updatedDish);
        } catch (RuntimeException e) {
            log.error("Error updating dish: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable UUID id) {
        try {
            UUID userId = getCurrentUserId();
            dishService.deleteDish(id, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting dish: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<DishDto>> searchDishes(@RequestParam String query) {
        UUID userId = getCurrentUserId();
        List<DishDto> dishes = dishService.fullTextSearch(query, userId);
        return ResponseEntity.ok(dishes);
    }
    
    @GetMapping("/search/name")
    public ResponseEntity<List<DishDto>> searchDishesByName(@RequestParam String name) {
        UUID userId = getCurrentUserId();
        List<DishDto> dishes = dishService.searchDishesByName(name, userId);
        return ResponseEntity.ok(dishes);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<DishDto>> getDishesByType(@PathVariable DishType type) {
        UUID userId = getCurrentUserId();
        List<DishDto> dishes = dishService.getDishesByType(type, userId);
        return ResponseEntity.ok(dishes);
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<DishDto>> getDishesByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        UUID userId = getCurrentUserId();
        List<DishDto> dishes = dishService.searchDishesByPriceRange(minPrice, maxPrice, userId);
        return ResponseEntity.ok(dishes);
    }
    
    @GetMapping("/sort/price")
    public ResponseEntity<List<DishDto>> getDishesSortedByPrice(
            @RequestParam(defaultValue = "asc") String order) {
        UUID userId = getCurrentUserId();
        boolean ascending = order.equalsIgnoreCase("asc");
        List<DishDto> dishes = dishService.getDishesSortedByPrice(userId, ascending);
        return ResponseEntity.ok(dishes);
    }
    
    @GetMapping("/sort/name")
    public ResponseEntity<List<DishDto>> getDishesSortedByName() {
        UUID userId = getCurrentUserId();
        List<DishDto> dishes = dishService.getDishesSortedByName(userId);
        return ResponseEntity.ok(dishes);
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Object[]> getDishStatistics() {
        UUID userId = getCurrentUserId();
        Object[] stats = dishService.getPriceStatistics(userId);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/statistics/by-type")
    public ResponseEntity<List<Object[]>> getDishStatisticsByType() {
        UUID userId = getCurrentUserId();
        List<Object[]> stats = dishService.getDishStatistics(userId);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/types")
    public ResponseEntity<DishType[]> getAllDishTypes() {
        return ResponseEntity.ok(DishType.values());
    }
    
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getDishCount() {
        UUID userId = getCurrentUserId();
        long count = dishService.getAllDishesForUser(userId).size();
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @GetMapping("/exists/{dishId}")
    public ResponseEntity<Map<String, Boolean>> checkDishExists(@PathVariable String dishId) {
        UUID userId = getCurrentUserId();
        boolean exists = dishService.existsByDishIdAndUserId(dishId, userId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}

package com.nusantara.dishmanager.service;

import com.nusantara.dishmanager.dto.DishDto;
import com.nusantara.dishmanager.entity.Dish;
import com.nusantara.dishmanager.entity.Dish.DishType;
import com.nusantara.dishmanager.entity.User;
import com.nusantara.dishmanager.repository.DishRepository;
import com.nusantara.dishmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DishService {
    
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    
    public DishDto createDish(DishDto dishDto, UUID userId) {
        log.info("Creating dish: {} for user: {}", dishDto.getName(), userId);
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        // Check if dish ID already exists for this user
        if (dishRepository.existsByDishIdAndUserId(dishDto.getDishId(), userId)) {
            throw new RuntimeException("Dish with ID " + dishDto.getDishId() + " already exists for this user");
        }
        
        Dish dish = Dish.builder()
                .dishId(dishDto.getDishId())
                .name(dishDto.getName())
                .type(dishDto.getType())
                .price(dishDto.getPrice())
                .ingredients(dishDto.getIngredients())
                .introduction(dishDto.getIntroduction())
                .photoUrl(dishDto.getPhotoUrl())
                .user(user)
                .build();
        
        Dish savedDish = dishRepository.save(dish);
        log.info("Dish created successfully with ID: {}", savedDish.getId());
        
        return DishDto.fromEntity(savedDish);
    }
    
    public Optional<DishDto> getDishById(UUID id) {
        return dishRepository.findById(id)
                .map(DishDto::fromEntity);
    }
    
    public Optional<DishDto> getDishByDishId(String dishId, UUID userId) {
        return dishRepository.findByDishIdAndUserId(dishId, userId)
                .map(DishDto::fromEntity);
    }
    
    public List<DishDto> getAllDishesForUser(UUID userId) {
        return dishRepository.findByUserId(userId).stream()
                .map(DishDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public Page<DishDto> getAllDishesForUser(UUID userId, Pageable pageable) {
        return dishRepository.findByUserId(userId, pageable)
                .map(DishDto::fromEntity);
    }
    
    public List<DishDto> getDishesByType(DishType type, UUID userId) {
        return dishRepository.findByTypeAndUserId(type, userId).stream()
                .map(DishDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<DishDto> searchDishesByName(String name, UUID userId) {
        return dishRepository.findByNameContainingAndUserId(name, userId).stream()
                .map(DishDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<DishDto> searchDishesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, UUID userId) {
        return dishRepository.findByPriceRangeAndUserId(minPrice, maxPrice, userId).stream()
                .map(DishDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<DishDto> fullTextSearch(String searchTerm, UUID userId) {
        return dishRepository.fullTextSearchForUser(searchTerm, userId).stream()
                .map(DishDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<DishDto> getDishesSortedByPrice(UUID userId, boolean ascending) {
        List<Dish> dishes = ascending ? 
                dishRepository.findByUserIdOrderByPriceAsc(userId) :
                dishRepository.findByUserIdOrderByPriceDesc(userId);
        
        return dishes.stream()
                .map(DishDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<DishDto> getDishesSortedByName(UUID userId) {
        return dishRepository.findByUserIdOrderByNameAsc(userId).stream()
                .map(DishDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public DishDto updateDish(UUID id, DishDto dishDto, UUID userId) {
        log.info("Updating dish with ID: {} for user: {}", id, userId);
        
        Dish existingDish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found with ID: " + id));
        
        // Verify ownership
        if (!existingDish.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Dish does not belong to user");
        }
        
        // Update fields
        existingDish.setName(dishDto.getName());
        existingDish.setType(dishDto.getType());
        existingDish.setPrice(dishDto.getPrice());
        existingDish.setIngredients(dishDto.getIngredients());
        existingDish.setIntroduction(dishDto.getIntroduction());
        existingDish.setPhotoUrl(dishDto.getPhotoUrl());
        
        Dish updatedDish = dishRepository.save(existingDish);
        log.info("Dish updated successfully");
        
        return DishDto.fromEntity(updatedDish);
    }
    
    public void deleteDish(UUID id, UUID userId) {
        log.info("Deleting dish with ID: {} for user: {}", id, userId);
        
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found with ID: " + id));
        
        // Verify ownership
        if (!dish.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Dish does not belong to user");
        }
        
        dishRepository.deleteById(id);
        log.info("Dish deleted successfully");
    }
    
    public List<Object[]> getDishStatistics(UUID userId) {
        return dishRepository.countDishesByTypeForUser(userId);
    }
    
    public Object[] getPriceStatistics(UUID userId) {
        return dishRepository.getDishStatisticsForUser(userId);
    }
    
    public boolean existsByDishIdAndUserId(String dishId, UUID userId) {
        return dishRepository.existsByDishIdAndUserId(dishId, userId);
    }
}

package com.nusantara.dishmanager.dto;

import com.nusantara.dishmanager.entity.Dish.DishType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishDto {
    
    private UUID id;
    private String dishId;
    private String name;
    private DishType type;
    private BigDecimal price;
    private String ingredients;
    private String introduction;
    private String photoUrl;
    private UUID userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // For API responses (without user info)
    public static DishDto fromEntity(com.nusantara.dishmanager.entity.Dish dish) {
        return DishDto.builder()
                .id(dish.getId())
                .dishId(dish.getDishId())
                .name(dish.getName())
                .type(dish.getType())
                .price(dish.getPrice())
                .ingredients(dish.getIngredients())
                .introduction(dish.getIntroduction())
                .photoUrl(dish.getPhotoUrl())
                .userId(dish.getUserId())
                .createdAt(dish.getCreatedAt())
                .updatedAt(dish.getUpdatedAt())
                .build();
    }
    
    // For creating new dishes
    public static DishDto createRequest(String dishId, String name, DishType type, 
                                      BigDecimal price, String ingredients, 
                                      String introduction, String photoUrl) {
        return DishDto.builder()
                .dishId(dishId)
                .name(name)
                .type(type)
                .price(price)
                .ingredients(ingredients)
                .introduction(introduction)
                .photoUrl(photoUrl)
                .build();
    }
}

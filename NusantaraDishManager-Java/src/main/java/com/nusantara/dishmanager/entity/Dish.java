package com.nusantara.dishmanager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dishes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dish {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @Column(name = "dish_id", nullable = false, unique = true, length = 20)
    private String dishId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private DishType type;
    
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients;
    
    @Column(name = "introduction", columnDefinition = "TEXT")
    private String introduction;
    
    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "user_id", insertable = false, updatable = false)
    private UUID userId;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum DishType {
        AYAM("Ayam"),
        SAPI("Sapi"),
        IKAN("Ikan"),
        UDANG("Udang"),
        TEMPE("Tempe"),
        TAHU("Tahu"),
        TELUR("Telur"),
        KAMBING("Kambing"),
        MINUMAN("Minuman"),
        KUE("Kue"),
        NASI("Nasi");
        
        private final String displayName;
        
        DishType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Default constructor for JPA
    public Dish(String dishId, String name, DishType type, BigDecimal price, 
                String ingredients, String introduction, String photoUrl, User user) {
        this.dishId = dishId;
        this.name = name;
        this.type = type;
        this.price = price;
        this.ingredients = ingredients;
        this.introduction = introduction;
        this.photoUrl = photoUrl;
        this.user = user;
        this.userId = user.getId();
    }
}

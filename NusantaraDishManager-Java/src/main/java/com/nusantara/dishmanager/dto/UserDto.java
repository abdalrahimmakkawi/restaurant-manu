package com.nusantara.dishmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    
    private UUID id;
    private String email;
    private String displayName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static UserDto fromEntity(com.nusantara.dishmanager.entity.User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
    
    public static UserDto createRequest(String email, String displayName) {
        return UserDto.builder()
                .email(email)
                .displayName(displayName)
                .build();
    }
}

package com.nusantara.dishmanager.service;

import com.nusantara.dishmanager.dto.UserDto;
import com.nusantara.dishmanager.entity.User;
import com.nusantara.dishmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserDto createUser(UserDto userDto) {
        log.info("Creating user with email: {}", userDto.getEmail());
        
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("User with email " + userDto.getEmail() + " already exists");
        }
        
        User user = User.builder()
                .email(userDto.getEmail())
                .displayName(userDto.getDisplayName())
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());
        
        return UserDto.fromEntity(savedUser);
    }
    
    public Optional<UserDto> getUserById(UUID id) {
        return userRepository.findById(id)
                .map(UserDto::fromEntity);
    }
    
    public Optional<UserDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserDto::fromEntity);
    }
    
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public UserDto updateUser(UUID id, UserDto userDto) {
        log.info("Updating user with ID: {}", id);
        
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        
        existingUser.setDisplayName(userDto.getDisplayName());
        
        User updatedUser = userRepository.save(existingUser);
        log.info("User updated successfully");
        
        return UserDto.fromEntity(updatedUser);
    }
    
    public void deleteUser(UUID id) {
        log.info("Deleting user with ID: {}", id);
        
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        
        userRepository.deleteById(id);
        log.info("User deleted successfully");
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public boolean existsById(UUID id) {
        return userRepository.existsById(id);
    }
}

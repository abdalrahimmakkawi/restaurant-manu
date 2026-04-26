package com.nusantara.dishmanager.repository;

import com.nusantara.dishmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> findByEmailWithDishes(String email);
    
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.id = ?1")
    boolean existsById(UUID id);
}

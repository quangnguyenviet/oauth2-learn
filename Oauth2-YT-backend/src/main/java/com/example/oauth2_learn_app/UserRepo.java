package com.example.oauth2_learn_app;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, String> {
    User findByEmail(String email);
}

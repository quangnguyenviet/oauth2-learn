package com.example.oauth2_learn_app;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id; // Thường dùng String cho User ID trong các ứng dụng OAuth2/SSO

    @Column(nullable = false)
    private String name;

//    @Column(nullable = false)
    private String picture; // URL ảnh đại diện

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;


}
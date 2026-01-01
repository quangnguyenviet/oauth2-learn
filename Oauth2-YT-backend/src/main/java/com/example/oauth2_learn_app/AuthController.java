package com.example.oauth2_learn_app;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {
    @GetMapping("/api/user")
    public ResponseEntity<Map<String, Object>> getUserInfo(OAuth2AuthenticationToken auth){
        if (auth == null){
            return ResponseEntity.status(401).build(); // Unauthorized
        } else {
            String picture = auth.getPrincipal().getAttribute("picture");
            Map<String, Object> userDetails = Map.of(
                    "name", auth.getPrincipal().getAttribute("name"),
                    "email", auth.getPrincipal().getAttribute("email"),
                    "picture", picture != null ? picture : ""
            );
            return ResponseEntity.ok(userDetails);
        }
    }
}

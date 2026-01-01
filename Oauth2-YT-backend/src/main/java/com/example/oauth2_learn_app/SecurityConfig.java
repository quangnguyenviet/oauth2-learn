package com.example.oauth2_learn_app;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOidcUserService customOidcUserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configure CORS to allow requests from the specified origin
                .cors(cors -> cors.configurationSource(req -> {
                    CorsConfiguration cfg = new CorsConfiguration();
                    cfg.addAllowedOrigin("http://localhost:5173"); // Frontend origin
                    cfg.setAllowCredentials(true); // Allow credentials (cookies, etc.)
                    return cfg;
                }))
                // Disable CSRF protection (not recommended for production without proper handling)
                .csrf(csrf -> csrf.disable())
                // Configure authorization rules
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/", "/login", "/api/user").permitAll() // Public endpoints
                        .anyRequest().authenticated() // All other endpoints require authentication
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Configure OAuth2 login
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                // Use the custom OIDC user service to process user info
                                .oidcUserService(customOidcUserService)
                        ).successHandler(oAuth2LoginSuccessHandler)
                        // Redirect to the frontend after successful login (session-based)
//                        .defaultSuccessUrl("http://localhost:5173", true)
                )
                // Configure logout behavior (session-based)
//                .logout(logout -> logout
//                        .logoutSuccessUrl("http://localhost:5173/login") // Redirect after logout
//                        .invalidateHttpSession(true) // Invalidate session
//                        .clearAuthentication(true) // Clear authentication
//                        .deleteCookies("JSESSIONID") // Delete session cookie
//                        .permitAll() // Allow logout for all users
//                )
                // Configure exception handling for unauthorized and forbidden requests
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"); // 401
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden"); // 403
                        })
                );
        return http.build(); // Build and return the SecurityFilterChain
    }
}
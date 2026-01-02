package com.example.oauth2_learn_app;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public OAuth2LoginSuccessHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // using popup window to do oauth2 login
//    @Override
//    public void onAuthenticationSuccess(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            Authentication authentication
//    ) throws IOException {
//
//        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
//        String token = jwtService.generateToken(oidcUser.getEmail());
//
//        // Send JS script that posts token to opener window
//        response.setContentType("text/html");
//        response.getWriter().write("""
//            <script>
//                window.opener.postMessage({ token: '%s' }, 'http://localhost:5173');
//                window.close();
//            </script>
//            """.formatted(token));
//    }

    // using redirect (token is in url) to do oauth2 login
//    @Override
//    public void onAuthenticationSuccess(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            Authentication authentication
//    ) throws IOException {
//        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
//        String token = jwtService.generateToken(oidcUser.getEmail());
//
//        // Redirect to frontend with token as query parameter
//        String redirectUrl = "http://localhost:5173/oauth2/callback?token=" + token;
//        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
//    }

    // using httpOnly cookie to send refresh token
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
        String token = jwtService.generateToken(oidcUser.getEmail());
        // Set token in HttpOnly cookie
        RefreshToken refreshToken = refreshTokenService.create(oidcUser.getEmail());
        Cookie cookie = new Cookie("refreshToken", refreshToken.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);
        // redirect về frontend
        response.sendRedirect(
                "http://localhost:3000/oauth2/redirect"
        );

}


package com.example.oauth2_learn_app;

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
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
        String token = jwtService.generateToken(oidcUser.getEmail());

        // Redirect to frontend with token as query parameter
        String redirectUrl = "http://localhost:5173/oauth2/callback?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

}


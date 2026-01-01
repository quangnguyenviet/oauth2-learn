package com.example.oauth2_learn_app;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
public class CustomOidcUserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    private final OidcUserService oidcUserService;
    private final UserRepo userRepo;
    public CustomOidcUserService(UserRepo userRepo){
        this.userRepo = userRepo;
        this.oidcUserService = new OidcUserService();
    }



    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("Loading OIDC user for registration ID: {}", registrationId);


        OidcUser oidcUser = oidcUserService.loadUser(userRequest);

        String name = oidcUser.getAttribute("name");
        String email = oidcUser.getAttribute("email");
        log.info("User name: {}, email: {}", name, email);

        User user = userRepo.findByEmail(email);
        if (user == null) {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .picture(oidcUser.getAttribute("picture"))
                    .role(RoleEnum.USER) // Mặc định gán vai trò USER
                    .build();
            userRepo.save(user);
            log.info("Created new user: {}", user);
        } else {
            log.info("User already exists: {}", user);
        }

        return oidcUser;
    }

}
